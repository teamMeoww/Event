const Organization = require('../../models/Organization');
const User = require('../../models/User');

// @desc    Create a new organization
// @route   POST /api/v1/organizations
// @access  Private (ORGANIZER)
const createOrganization = async (req, res, next) => {
  try {
    const { name, description, website } = req.body;

    const organization = await Organization.create({
      name,
      description,
      website,
      ownerId: req.user._id,
      members: [{ userId: req.user._id, role: 'ADMIN' }]
    });

    // Update user to link organization
    await User.findByIdAndUpdate(req.user._id, {
      organizationId: organization._id,
      role: 'ORGANIZER' // Ensure they have the organizer role
    });

    res.status(201).json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my organization
// @route   GET /api/v1/organizations/me
// @access  Private (ORGANIZER)
const getMyOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findOne({ ownerId: req.user._id })
      .populate('members.userId', 'name email profileImage');

    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrganization,
  getMyOrganization
};
