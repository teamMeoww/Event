const Checkin = require('../../models/Checkin');
const Event = require('../../models/Event');

// @desc    Get volunteer dashboard data
// @route   GET /api/v1/volunteer/dashboard
// @access  Private (VOLUNTEER or ORGANIZER)
const getVolunteerDashboard = async (req, res, next) => {
  try {
    const totalScans = await Checkin.countDocuments({ volunteerId: req.user._id });

    // Count today's scans
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayScans = await Checkin.countDocuments({
      volunteerId: req.user._id,
      checkedInAt: { $gte: startOfDay }
    });

    const assignedEvents = await Event.countDocuments({ volunteers: req.user._id, status: { $in: ['PUBLISHED', 'ONGOING'] } });

    res.json({
      success: true,
      data: {
        totalScans,
        todayScans,
        assignedEvents,
        reputationScore: totalScans * 10 // Mock reputation score based on scans
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assigned events
// @route   GET /api/v1/volunteer/events
// @access  Private (VOLUNTEER or ORGANIZER)
const getAssignedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ volunteers: req.user._id })
      .select('title startDate endDate coverImage venue status')
      .sort({ startDate: 1 });

    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scan history
// @route   GET /api/v1/volunteer/scan-history
// @access  Private (VOLUNTEER or ORGANIZER)
const getScanHistory = async (req, res, next) => {
  try {
    const history = await Checkin.find({ volunteerId: req.user._id })
      .populate('eventId', 'title')
      .populate('participantId', 'name')
      .sort({ checkedInAt: -1 })
      .limit(50);

    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVolunteerDashboard,
  getAssignedEvents,
  getScanHistory
};
