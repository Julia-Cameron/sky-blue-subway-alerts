const Report = require('../models/Report');
const Station = require('../models/Station');
const Line = require('../models/Line');

// GET /api/reports - Get active transit reports (newest first)
exports.getReports = async (req, res) => {
    try {
        const { line } = req.query;
        let query = { status: 'Active' };

        // Optional filtering by line ID
        if (line) {
            query.line = line;
        }

        // Index { status: 1, createdAt: 1 } optimizes active reports feed
        const reports = await Report.find(query)
            .populate('line', 'name number')
            .populate('station', 'name order')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (err) {
        console.error('getReports error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// POST /api/reports - Create a new delay report
exports.createReport = async (req, res) => {
    try {
        const { line, station, description } = req.body;

        if (!line || !station || !description) {
            return res.status(400).json({ message: 'Line, station, and description are required.' });
        }

        // Verify that the station actually belongs to the given line per SB-14
        const validStation = await Station.findOne({ _id: station, line: line });
        if (!validStation) {
            return res.status(400).json({ message: 'Selected station does not belong to this line.' });
        }

        // Create report: creator counts as the first voter, votes start at 1
        const report = await Report.create({
            line,
            station,
            description: description.trim(),
            createdBy: req.user.id,
            voters: [req.user.id],
            votes: 1,
            status: 'Active'
        });

        const populatedReport = await Report.findById(report._id)
            .populate('line', 'name number')
            .populate('station', 'name order')
            .populate('createdBy', 'name');

        return res.status(201).json({
            success: true,
            report: populatedReport
        });
    } catch (err) {
        console.error('createReport error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// PATCH /api/reports/:id/vote - Upvote a report ("Still happening") using atomic SB-14 logic
exports.voteReport = async (req, res) => {
    try {
        const reportId = req.params.id;
        const userId = req.user.id;

        // Atomic update matching SB-14 spec: adds vote only if user hasn't voted yet and status is Active
        const result = await Report.updateOne(
            { _id: reportId, status: 'Active', voters: { $ne: userId } },
            { $push: { voters: userId }, $inc: { votes: 1 } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ 
                message: 'Unable to vote. You may have already voted, the report is resolved, or it does not exist.' 
            });
        }

        const updatedReport = await Report.findById(reportId)
            .populate('line', 'name number')
            .populate('station', 'name order');

        return res.status(200).json({
            success: true,
            message: 'Vote recorded successfully',
            votes: updatedReport.votes
        });
    } catch (err) {
        console.error('voteReport error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// PATCH /api/reports/:id/resolve - Mark a report as resolved (Moderator only or Creator)
exports.resolveReport = async (req, res) => {
    try {
        const reportId = req.params.id;
        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({ message: 'Report not found.' });
        }

        // Check if user is the creator or a moderator
        if (report.createdBy.toString() !== req.user.id && req.user.role !== 'moderator') {
            return res.status(403).json({ message: 'Not authorized to resolve this report.' });
        }

        report.status = 'Resolved';
        report.resolvedAt = new Date();
        await report.save();

        return res.status(200).json({
            success: true,
            message: 'Report marked as resolved.',
            report
        });
    } catch (err) {
        console.error('resolveReport error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// PUT /api/reports/:id - Update an existing report's line, station, or description (Creator or Moderator)
exports.updateReport = async (req, res) => {
    try {
        const { description, line, station } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found.' });
        }

        // Check if user is the creator or a moderator
        if (report.createdBy.toString() !== req.user.id && req.user.role !== 'moderator') {
            return res.status(403).json({ message: 'Not authorized to update this report.' });
        }

        // Determine target line and station (fall back to existing ones if not provided)
        const targetLine = line || report.line;
        const targetStation = station || report.station;

        // If either line or station is being updated, validate their relationship per SB-14 rules
        if (line || station) {
            const validStation = await Station.findOne({ _id: targetStation, line: targetLine });
            if (!validStation) {
                return res.status(400).json({ message: 'Selected station does not belong to this line.' });
            }
            report.line = targetLine;
            report.station = targetStation;
        }

        // Update description if provided
        if (description) {
            report.description = description.trim();
        }

        await report.save();

        const updatedReport = await Report.findById(report._id)
            .populate('line', 'name number')
            .populate('station', 'name order')
            .populate('createdBy', 'name');

        return res.status(200).json({
            success: true,
            message: 'Report updated successfully',
            report: updatedReport
        });
    } catch (err) {
        console.error('updateReport error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// DELETE /api/reports/:id - Delete a report (Creator or Moderator)
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found.' });
        }

        // Check if user is the creator or a moderator
        if (report.createdBy.toString() !== req.user.id && req.user.role !== 'moderator') {
            return res.status(403).json({ message: 'Not authorized to delete this report.' });
        }

        await report.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'Report deleted successfully'
        });
    } catch (err) {
        console.error('deleteReport error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};