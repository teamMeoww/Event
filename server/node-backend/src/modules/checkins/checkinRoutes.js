const express = require('express');
const router = express.Router();
const { scanTicket } = require('./checkinController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.post('/scan', protect, authorize('VOLUNTEER', 'ORGANIZER'), scanTicket);

module.exports = router;
