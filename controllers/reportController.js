const { Report, Vote } = require('../models');

// ==========================================
// 1. GET LIVE FEED (Active Reports)
// ==========================================
exports.getLiveFeed = async (req, res) => {
  try {
    // Utilizes the compound index: { status: 1, createdAt: -1 }
    const activeReports = await Report.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .populate('routeId', 'code name mode color')
      .populate('stopId', 'name location')
      .populate('reportedBy', 'displayName');

    res.status(200).json({
      success: true,
      count: activeReports.length,
      data: activeReports
    });
  } catch (err) {
    console.error('getLiveFeed error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// ==========================================
// 2. CREATE A NEW INCIDENT REPORT
// ==========================================
exports.createReport = async (req, res) => {
  try {
    const { routeId, stopId, direction, reason, note } = req.body;

    // Validate required fields
    if (!routeId || !reason) {
      return res.status(400).json({ message: 'Route and reason are required fields.' });
    }

    // Create the report, linking it to the authenticated user (req.user.id)
    const newReport = await Report.create({
      reportedBy: req.user.id,
      routeId,
      stopId: stopId || undefined,
      direction,
      reason,
      note: note ? note.trim() : undefined,
      status: 'active',
      votesCount: 1, // Author's initial automatic confirmation vote
      lastActivityAt: Date.now()
    });

    // Automatically create a matching initial "still" vote for the creator
    try {
      await Vote.create({
        reportId: newReport._id,
        userId: req.user.id,
        type: 'still'
      });
    } catch (voteErr) {
      // Non-critical if auto-vote fails, but good to handle
      console.warn('Auto-vote creation note:', voteErr.message);
    }

    // Populate route details for immediate frontend display
    const populatedReport = await Report.findById(newReport._id)
      .populate('routeId', 'code name mode color')
      .populate('stopId', 'name')
      .populate('reportedBy', 'displayName');

    res.status(201).json({
      success: true,
      message: 'Transit delay reported successfully.',
      data: populatedReport
    });

  } catch (err) {
    console.error('createReport error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// ==========================================
// 3. CAST "STILL HAPPENING" VOTE
// ==========================================
exports.voteStillHappening = async (req, res) => {
  try {
    const { id: reportId } = req.params;
    const userId = req.user.id;

    // Attempt to create a vote document. 
    // The unique index { reportId: 1, userId: 1 } blocks duplicate votes at the DB level!
    await Vote.create({
      reportId,
      userId,
      type: 'still'
    });

    // If successful, increment votesCount and refresh lastActivityAt
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      {
        $inc: { votesCount: 1 },
        lastActivityAt: Date.now()
      },
      { new: true }
    ).populate('routeId', 'code name');

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Vote recorded: Still happening.',
      data: updatedReport
    });

  } catch (err) {
    // MongoDB duplicate key error code 11000 means user already voted on this report
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already voted on this report.' });
    }
    console.error('voteStillHappening error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// ==========================================
// 4. RESOLVE A REPORT (Change status)
// ==========================================
exports.resolveReport = async (req, res) => {
  try {
    const { id: reportId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    // Optional check: Ensure user is the creator or a moderator/admin
    if (report.reportedBy.toString() !== req.user.id && req.user.role !== 'moderator') {
      return res.status(403).json({ message: 'Not authorized to resolve this report.' });
    }

    report.status = 'resolved';
    report.resolvedAt = Date.now();
    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report marked as resolved.',
      data: report
    });

  } catch (err) {
    console.error('resolveReport error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};