const express = require('express');
const router = express.Router();
const { getMyCredentials, issueCredentials } = require('./credentialController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// Get participant's credentials
router.get('/me', protect, getMyCredentials);

// Note: The issueCredentials route would typically be mounted in the eventRoutes router
// router.post('/events/:eventId/credentials/issue', protect, authorize('ORGANIZER'), issueCredentials);

module.exports = router;
