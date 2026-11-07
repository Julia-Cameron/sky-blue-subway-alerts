const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const moderatorController = require('../controllers/moderatorController');

// Every route in this file needs a valid token AND the moderator role
router.use(protect, requireRole('moderator'));

router.get('/reports', moderatorController.getAllReports);
router.patch('/reports/:id/resolve', moderatorController.resolveReport);
router.delete('/reports/:id', moderatorController.deleteReport);

module.exports = router;
