const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/auth'); // Import auth middleware

// Protect these routes with the JWT middleware
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

module.exports = router;