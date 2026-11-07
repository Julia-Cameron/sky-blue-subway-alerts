// Role check (SB-30). Use it AFTER the "protect" middleware, which reads the token and sets req.user.
// Example: router.delete('/reports/:id', protect, requireRole('moderator'), deleteReport);
const requireRole = (...roles) => (req, res, next) => {
    // protect did not run or did not find a user
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    // The role comes from the signed token, so the user cannot change it
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: `Access denied. Allowed for: ${roles.join(' or ')}` });
    }

    return next();
};

module.exports = requireRole;
