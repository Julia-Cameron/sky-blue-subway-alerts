const mongoose = require('mongoose');
const{MOD_ACTIONS} = require('../config/Constant')

const moderatorSchema = new mongoose.Schema({
      
    reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
    moderatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String,enum : MOD_ACTIONS, required: true },
    note: { type: String, trim: true, maxlength: 280 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
moderationActionSchema.index({ reportId: 1, createdAt: -1 });
module.exports = new mongoose.model('Moderator',moderatorSchema);