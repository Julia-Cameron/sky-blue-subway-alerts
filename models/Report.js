const mongoose = require('mongoose');
const{DIRECTIONS, REASONS,REPORT_STATUS}= require('../config/Constant')

const reportSchema = new mongoose.Schema(
  {
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
    stopId: { type: Schema.Types.ObjectId, ref: 'Stop' }, // optional, mainly for buses
    direction: { type: String , enum :DIRECTIONS},
    reason: { type: String, required: true,enum :REASONS },
    note: { type: String, trim: true, maxlength: 280 },
    status: { type: String,enum : REPORT_STATUS, default: 'active' },
    votesCount: { type: Number, default: 0, min: 0 },      // kept in sync with Vote documents
    lastActivityAt: { type: Date, default: Date.now },      // reset by each vote; drives auto-resolve
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
reportSchema.index({ status: 1, createdAt: -1 });                   // live feed
reportSchema.index({ routeId: 1, stopId: 1, status: 1 });           // duplicate check
reportSchema.index({ status: 1, lastActivityAt: 1 });  