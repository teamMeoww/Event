const User = require('../../models/User');
const crypto = require('crypto');

// @desc    Get connected wallet
// @route   GET /api/v1/wallet
// @access  Private
const getWallet = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: req.user.walletAddress || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request a challenge nonce for signing
// @route   POST /api/v1/wallet/challenge
// @access  Private
const requestChallenge = async (req, res, next) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ success: false, message: 'Address is required' });
    }
    // For this prototype, generate a simple random nonce
    const nonce = crypto.randomBytes(16).toString('hex');
    res.json({
      success: true,
      data: {
        nonce,
        message: `Sign this message to authenticate your wallet: ${nonce}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify wallet signature
// @route   POST /api/v1/wallet/verify
// @access  Private
const verifyWallet = async (req, res, next) => {
  try {
    const { address, signature, nonce } = req.body;
    if (!address || !signature) {
      return res.status(400).json({ success: false, message: 'Address and signature required' });
    }
    // For prototype, we assume signature is valid
    // In prod, use ethers.js to verify signature matches address

    req.user.walletAddress = address;
    await req.user.save();

    res.json({
      success: true,
      data: req.user.walletAddress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Disconnect wallet
// @route   DELETE /api/v1/wallet
// @access  Private
const disconnectWallet = async (req, res, next) => {
  try {
    req.user.walletAddress = null;
    await req.user.save();
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWallet,
  requestChallenge,
  verifyWallet,
  disconnectWallet
};
