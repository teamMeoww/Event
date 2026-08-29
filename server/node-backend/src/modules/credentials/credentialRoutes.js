const express = require('express');
const router = express.Router();
const { getMyCredentials, getCredentialById, issueCredentials } = require('./credentialController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// Get participant's credentials
router.get('/', protect, getMyCredentials);

// Get single credential by ID
router.get('/:id', protect, getCredentialById);

module.exports = router;
