const User = require('../models/User');

// Helper to format user public data
const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
});

// GET /api/users/profile - Get currently authenticated user's profile
exports.getProfile = async (req, res) => {
    try {
        // req.user.id is expected to be populated by your auth middleware
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            user: toPublicUser(user)
        });
    } catch (err) {
        console.error('getProfile error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// PUT /api/users/profile - Update user profile details (name and/or email)
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updates = {};

        // If a name is provided, validate and add to updates
        if (name) {
            updates.name = name.trim();
        }

        // If an email is provided, validate format and uniqueness
        if (email) {
            const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const normalizedEmail = email.toLowerCase().trim();

            if (!EMAIL_FORMAT.test(normalizedEmail)) {
                return res.status(400).json({ message: 'Please enter a valid email i.e: user@somewhere.com' });
            }

            // Check if email is already used by another account
            const existingUser = await User.findOne({ 
                email: normalizedEmail, 
                _id: { $ne: req.user.id } // exclude current user
            });

            if (existingUser) {
                return res.status(409).json({ message: 'Email is already in use by another account' });
            }

            updates.email = normalizedEmail;
        }

        // Ensure at least one field is provided
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Please provide a name or email to update.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: toPublicUser(updatedUser)
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'An account with this email already exists' });
        }

        console.error('updateProfile error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};