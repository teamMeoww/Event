const User = require('../../models/User');

// @desc    Get passport profile (Current User)
// @route   GET /api/v1/passport/me
// @access  Private
const getPassportMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPassportMe
};
