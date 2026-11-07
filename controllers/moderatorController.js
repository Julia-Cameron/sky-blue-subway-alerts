const Report = require('../models/Report');

const withDetails = (query) => query
    .populate('line', 'name number')
    .populate('station', 'name order')
    .populate('createdBy', 'name');

// GET /api/moderator/reports?status=Active|Resolved - all reports, newest first
exports.getAllReports = async (req, res) => {
    try {
        const { status } = req.query;
        const query = {};

        if (status) {
            if (!['Active', 'Resolved'].includes(status)) {
                return res.status(400).json({ message: 'Status must be Active or Resolved.' });
            }
            query.status = status;
        }

        const reports = await withDetails(Report.find(query)).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: reports.length, reports });
    } catch (err) {
        console.error('getAllReports error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// PATCH /api/moderator/reports/:id/resolve - mark ANY report as resolved
exports.resolveReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found.' });
        }

        if (report.status !== 'Resolved') {
            report.status = 'Resolved';
            report.resolvedAt = new Date();
            await report.save();
        }

        return res.status(200).json({ success: true, message: 'Report marked as resolved.', report });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid report id.' });
        }
        console.error('resolveReport error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// DELETE /api/moderator/reports/:id - delete ANY report (spam, wrong or duplicate)
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found.' });
        }
        return res.status(200).json({ success: true, message: 'Report deleted.' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid report id.' });
        }
        console.error('deleteReport error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};
