const express = require('express');
const router = express.Router();
const { getWallet, requestChallenge, verifyWallet, disconnectWallet } = require('./walletController');
const { protect } = require('../../middleware/authMiddleware');

router.get('/', protect, getWallet);
router.post('/challenge', protect, requestChallenge);
router.post('/verify', protect, verifyWallet);
router.delete('/', protect, disconnectWallet);

module.exports = router;
