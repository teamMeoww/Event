const express = require('express');
const router = express.Router();
const { getVolunteerDashboard, getAssignedEvents, getScanHistory } = require('./volunteerController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.use(protect);
router.use(authorize('VOLUNTEER', 'ORGANIZER'));

router.get('/dashboard', getVolunteerDashboard);
router.get('/events', getAssignedEvents);
router.get('/scan-history', getScanHistory);

module.exports = router;
