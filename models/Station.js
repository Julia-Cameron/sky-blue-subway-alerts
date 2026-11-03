const mongoose = require('mongoose');

// Station model (see "Sky Blue — Database Design (SB-14)")
// One document per station per line: an interchange such as Bloor-Yonge has
// one document on Line 1 and another on Line 2, so a report names the platform.
const stationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Station name is required'],
			trim: true
		},
		line: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Line',
			required: [true, 'Line is required']
		},
		// Position along the line, so the dropdown follows the route.
		order: {
			type: Number,
			required: [true, 'Order is required'],
			min: 1
		}
	},
	{ timestamps: true }
);

// The same station can't be loaded twice on one line.
stationSchema.index({ line: 1, name: 1 }, { unique: true });

// Dropdown for one line, in route order.
stationSchema.statics.forLine = function (lineId) {
	return this.find({ line: lineId }).sort({ order: 1 }).select('name order');
};

module.exports = mongoose.model('Station', stationSchema);
