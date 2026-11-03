const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/signup - Register a new commuter account
router.post('/signup', authController.signup);

// POST /api/auth/signin - Login an existing user and return a JWT
router.post('/signin', authController.signin);

module.exports = router;