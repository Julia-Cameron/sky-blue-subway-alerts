// Makes an existing user a moderator, for testing and for the demo.
// Usage: node scripts/makeModerator.js user@example.com
// Afterwards that user must log in again to get a new token with the new role.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
    const email = (process.argv[2] || '').toLowerCase().trim();
    if (!email) {
        console.log('Usage: node scripts/makeModerator.js user@example.com');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate({ email }, { role: 'moderator' }, { new: true });
        console.log(user ? `${user.email} is now a moderator. Log in again to get a new token.` : 'No user found with that email.');
    } catch (err) {
        console.error('Failed:', err.message);
    } finally {
        await mongoose.disconnect();
    }
})();
