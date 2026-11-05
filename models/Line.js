const mongoose = require('mongoose');

// Line model (see "Sky Blue — Database Design (SB-14)")
// Preloaded TTC data: Lines 1, 2, 4, 5 and 6. Line 3 closed in 2023.
const lineSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Line name is required'],
			unique: true,
			trim: true // e.g. "Line 1"
		},
		number: {
			type: Number,
			required: [true, 'Line number is required'],
			unique: true // e.g. 1
		},
		// Route name, for places with room for it, e.g. the dropdown:
		// "Line 2 Bloor–Danforth". Badges can use just `name`.
		route: {
			type: String,
			required: [true, 'Route name is required'],
			trim: true // e.g. "Bloor–Danforth"
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Line', lineSchema);
