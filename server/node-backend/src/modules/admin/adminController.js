const Event = require('../../models/Event');
const User = require('../../models/User');
const Organization = require('../../models/Organization');

// @desc    Get system-wide stats
// @route   GET /api/v1/admin/stats
// @access  Private (SUPER_ADMIN)
const getAdminStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const pendingEvents = await Event.countDocuments({ status: 'PENDING_APPROVAL' });
    const publishedEvents = await Event.countDocuments({ status: 'PUBLISHED' });
    
    const totalUsers = await User.countDocuments();
    const totalParticipants = await User.countDocuments({ role: 'PARTICIPANT' });
    const totalVolunteers = await User.countDocuments({ role: 'VOLUNTEER' });
    const totalOrganizers = await User.countDocuments({ role: 'ORGANIZER' });

    const totalOrganizations = await Organization.countDocuments();

    res.json({
      success: true,
      data: {
        events: {
          total: totalEvents,
          pending: pendingEvents,
          published: publishedEvents
        },
        users: {
          total: totalUsers,
          participants: totalParticipants,
          volunteers: totalVolunteers,
          organizers: totalOrganizers
        },
        organizations: {
          total: totalOrganizations
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events
// @route   GET /api/v1/admin/events
// @access  Private (SUPER_ADMIN)
const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('organizationId', 'name')
      .populate('organizerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all organizations
// @route   GET /api/v1/admin/organizations
// @access  Private (SUPER_ADMIN)
const getAllOrganizations = async (req, res, next) => {
  try {
    const orgs = await Organization.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orgs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all volunteers
// @route   GET /api/v1/admin/volunteers
// @access  Private (SUPER_ADMIN)
const getAllVolunteers = async (req, res, next) => {
  try {
    const volunteers = await User.find({ role: 'VOLUNTEER' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: volunteers });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllEvents,
  getAllOrganizations,
  getAllVolunteers
};
