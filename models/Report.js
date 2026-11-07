const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    line: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Line',
      required: true,
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved'],
      default: 'Active',
    },
    votes: {
      type: Number,
      default: 1,
      min: 0,
    },
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Fast feed querying index: active reports sorted by newest first
reportSchema.index({ status: 1, createdAt: 1 });

module.exports = mongoose.model('Report', reportSchema);