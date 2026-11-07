const express = require('express');
const router = express.Router();
const transitController = require('../controllers/transitController');

router.get('/lines', transitController.getLines);
router.get('/lines/:lineId/stations', transitController.getStationsByLine);

module.exports = router;