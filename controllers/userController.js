const User = require('../models/User');
const bcrypt = require('bcrypt');

// Helper function to return public user data (never expose passwordHash)
const toPublicUser = (user) => ({
  id: user._id,
  displayname: user.displayname,
  email: user.email,
  role: user.role,
  primaryLine: user.primaryLine,
  createdAt: user.createdAt
});

// ==========================================
// 1. GET USER PROFILE
// ==========================================
exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id comes from  authentication middleware (JWT verification)
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: toPublicUser(user)
    });

  } catch (err) {
    console.error('getUserProfile error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// ==========================================
// 2. UPDATE USER PROFILE (Display Name / Primary Line)
// ==========================================
exports.updateUserProfile = async (req, res) => {
  try {
    const { displayname, primaryLine } = req.body;

    const updatedData = {};
    if (displayname) updatedData.displayname = displayname.trim();
    if (primaryLine) updatedData.primaryLine = primaryLine;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: toPublicUser(user)
    });

  } catch (err) {
    console.error('updateUserProfile error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// ==========================================
// 3. UPDATE PASSWORD
// ==========================================
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
    }

    // Find user and explicitly select passwordHash since it's hidden by default
    const user = await User.findById(req.user.id).select('+passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Hash new password and save
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.'
    });

  } catch (err) {
    console.error('updatePassword error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};