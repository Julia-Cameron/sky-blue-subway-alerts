const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// Function to Generate Tokens
const signinToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Function to Return Public Data to the Client 
const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
});

// POST /api/auth/signup
exports.signup = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // Validate all fields
        if (!email || !name || !password) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Validate Email format
        if (!EMAIL_FORMAT.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email i.e: user@somewhere.com' });
        }

        // Validate Password Length
        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ message: 'Password MUST be at least 8 characters' });
        }

        // Check Existing User by Email
        const exist = await User.findOne({ email: email.toLowerCase().trim() });
        if (exist) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // Hash the Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save User (Matched SB-14 schema fields: name, password, role)
        const saveUser = await User.create({
            email: email.toLowerCase().trim(),
            name,
            password: hashedPassword,
            role: 'commuter' 
        });

        return res.status(201).json({
            token: signinToken(saveUser),
            user: toPublicUser(saveUser)
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'An account with this email already exists' });
        }

        console.error('signup error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again', error: err.message });
    }
};

// POST /api/auth/signin
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate Empty fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required!' });
        }

        // Explicitly select password since select: false is set in the SB-14 User schema
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        const invalid = { message: 'Invalid email or password' };

        if (!user) return res.status(401).json(invalid);

        const matches = await bcrypt.compare(password, user.password);
        if (!matches) return res.status(401).json(invalid);

        return res.status(200).json({
            token: signinToken(user),
            user: toPublicUser(user)
        });

    } catch (err) {
        console.error('signin error:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};