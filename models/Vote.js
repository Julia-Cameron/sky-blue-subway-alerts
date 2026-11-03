const mongoose = require('mongoose')
const {VOTE_TYPES} = require('../config/Constant')

const voteSchema = new mongoose.Schema(
  {
    reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String,enum:VOTE_TYPES, default: 'still' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
// Ensures a user can only vote "still happening" once per report
voteSchema.index({ reportId: 1, userId: 1 }, { unique: true });
module.exports = new mongoose.model('Vote',voteSchema);