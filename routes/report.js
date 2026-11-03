const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const protect = require('../middleware/auth');

router.route('/')
    .get(reportController.getReports)
    .post(protect, reportController.createReport);

router.patch('/:id/vote', protect, reportController.voteReport);
router.patch('/:id/resolve', protect, reportController.resolveReport);

module.exports = router;