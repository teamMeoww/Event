const express = require('express');
const router = express.Router();
const { getAdminStats, getAllEvents, getAllOrganizations, getAllVolunteers } = require('./adminController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.get('/stats', getAdminStats);
router.get('/events', getAllEvents);
router.get('/organizations', getAllOrganizations);
router.get('/volunteers', getAllVolunteers);

module.exports = router;
