const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Prevents returning hash in queries
    },
    role: {
      type: String,
      enum: ['commuter', 'moderator'],
      default: 'commuter',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);