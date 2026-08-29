const express = require('express');
const router = express.Router();
const { createOrganization, getMyOrganization, getOrganizationVolunteers, toggleVolunteerAccess } = require('./organizationController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.post('/', protect, authorize('ORGANIZER'), createOrganization);
router.get('/me', protect, authorize('ORGANIZER'), getMyOrganization);
router.get('/me/volunteers', protect, authorize('ORGANIZER'), getOrganizationVolunteers);
router.patch('/me/volunteers/:volunteerId/access', protect, authorize('ORGANIZER'), toggleVolunteerAccess);

module.exports = router;
