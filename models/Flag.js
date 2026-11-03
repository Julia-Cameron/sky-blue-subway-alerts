const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema(
  {
    reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewed: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);


flagSchema.index({ reportId: 1, userId: 1 }, { unique: true });
flagSchema.index({ reviewed: 1, createdAt: -1 }); // moderator "Flagged" tab
module.exports = mongoose.model('Flag',flagSchema);