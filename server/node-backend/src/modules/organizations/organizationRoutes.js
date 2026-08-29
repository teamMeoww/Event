const express = require('express');
const router = express.Router();
const { createOrganization, getMyOrganization } = require('./organizationController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.post('/', protect, authorize('ORGANIZER'), createOrganization);
router.get('/me', protect, authorize('ORGANIZER'), getMyOrganization);

module.exports = router;
