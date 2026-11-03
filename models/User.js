const mongoose = require('mongoose');

// SB-16 — User model (see "Sky Blue — Database Design (SB-14)")
// Password is stored as a bcrypt hash only. Hash it in the controller or a
// pre('save') hook, and check the minimum length (6 or 8 — Mon Nov 2 decision)
// on the plain text BEFORE hashing, since the hash is always 60 characters.
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			maxlength: 60
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			select: false // never returned unless asked for with .select('+password')
		},
		role: {
			type: String,
			enum: ['user', 'moderator'],
			default: 'user'
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
