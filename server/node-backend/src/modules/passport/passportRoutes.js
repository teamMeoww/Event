const express = require('express');
const router = express.Router();
const { getPassportMe } = require('./passportController');
const { protect } = require('../../middleware/authMiddleware');

router.get('/me', protect, getPassportMe);

module.exports = router;
