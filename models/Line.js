const mongoose = require('mongoose');

const lineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true, // e.g., "Line 1"
  },
  number: {
    type: Number,
    required: true,
    unique: true, // 1, 2, 4, 5, 6
  },
	route: {
		type: String,
		trim: true, // e.g., "Bloor–Danforth", so the dropdown can show "Line 2 Bloor–Danforth"
	},
});

module.exports = mongoose.model('Line', lineSchema);