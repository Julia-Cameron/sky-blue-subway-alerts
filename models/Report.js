const mongoose = require('mongoose');

// SB-17 — Report model (see "Sky Blue — Database Design (SB-14)")
// Status is only Active or Resolved. Deleting a report removes the document;
// there is no "Deleted" status.
const reportSchema = new mongoose.Schema(
	{
		// Kept beside station so the feed can filter by line later (SB-12).
		line: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Line',
			required: [true, 'Line is required']
		},
		// Must belong to the line above (checked in pre('validate') below).
		station: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Station',
			required: [true, 'Station is required']
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
			trim: true,
			maxlength: 500
		},
		status: {
			type: String,
			enum: ['Active', 'Resolved'],
			default: 'Active'
		},
		// "Still happening" count. The creator counts as the first confirmation.
		votes: {
			type: Number,
			default: 1,
			min: 0
		},
		// Who has voted, so nobody can vote twice. Not sent to the client.
		voters: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		// Set from the logged-in user's token, never from the request body.
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		resolvedAt: {
			type: Date
		}
	},
	{ timestamps: true }
);

// Reject a station that isn't on the chosen line.
// Note: this runs on create() and save(). findByIdAndUpdate() skips it, so
// edit a report by loading it, changing the fields, and calling save().
reportSchema.pre('validate', async function () {
	if (!this.isModified('line') && !this.isModified('station')) {
		return;
	}
	if (!this.line || !this.station) {
		return; // the required validators report the missing field
	}
	const station = await mongoose.model('Station').findById(this.station).select('line');
	if (!station) {
		this.invalidate('station', 'Station not found');
	} else if (!station.line.equals(this.line)) {
		this.invalidate('station', 'That station is not on the selected line');
	}
});

// The creator's report counts as their vote.
reportSchema.pre('save', function () {
	if (this.isNew && this.voters.length === 0) {
		this.voters.push(this.createdBy);
	}
});

// Live feed: active reports, newest first.
reportSchema.index({ status: 1, createdAt: -1 });

// Hide the voters list in API responses.
reportSchema.set('toJSON', {
	transform: (doc, ret) => {
		delete ret.voters;
		return ret;
	}
});

// Adds one vote if this user hasn't voted yet. Returns true if the vote counted.
reportSchema.statics.addVote = async function (reportId, userId) {
	const result = await this.updateOne(
		{ _id: reportId, status: 'Active', voters: { $ne: userId } },
		{ $push: { voters: userId }, $inc: { votes: 1 } }
	);
	return result.modifiedCount === 1;
};

module.exports = mongoose.model('Report', reportSchema);
