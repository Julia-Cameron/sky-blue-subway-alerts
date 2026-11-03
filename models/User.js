const mongoose = require('mongoose');
const { ROLES } = require('../config/Constant');

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        passwordHash: { type: String, required: true, select: false },
        displayName: { type: String, required: true, trim: true, maxlength: 40 },
        role: { type: String, enum: ROLES, default: 'commuter' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);