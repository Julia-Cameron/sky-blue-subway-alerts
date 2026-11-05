const Line = require('../models/Line');
const Station = require('../models/Station');

// GET /api/lines - Get all transit lines
exports.getLines = async (req, res) => {
    try {
        const lines = await Line.find().sort({ number: 1 });
        return res.status(200).json({
            success: true,
            count: lines.length,
            lines
        });
    } catch (err) {
        console.error('getLines error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// GET /api/lines/:lineId/stations - Get all stations for a specific line
exports.getStationsByLine = async (req, res) => {
    try {
        const { lineId } = req.params;

        // Verify line exists
        const line = await Line.findById(lineId);
        if (!line) {
            return res.status(404).json({ message: 'Line not found.' });
        }

        const stations = await Station.find({ line: lineId }).sort({ order: 1 });
        return res.status(200).json({
            success: true,
            line: line.name,
            count: stations.length,
            stations
        });
    } catch (err) {
        console.error('getStationsByLine error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};