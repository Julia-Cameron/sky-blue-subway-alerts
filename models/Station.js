const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // e.g., "Bloor-Yonge"
  },
  line: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Line',
    required: true,
  },
  order: {
    type: Number,
    required: true, // Station position sequence along the line
  },
});

// Compound unique index stops duplicate station entries on the same line
stationSchema.index({ line: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Station', stationSchema);