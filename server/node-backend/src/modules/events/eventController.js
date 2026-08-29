const Event = require('../../models/Event');
const Registration = require('../../models/Registration');
const Ticket = require('../../models/Ticket');
const Checkin = require('../../models/Checkin');
const User = require('../../models/User');
const crypto = require('crypto');

// @desc    Get all published events
// @route   GET /api/v1/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'PUBLISHED' };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const startIndex = (Number(page) - 1) * Number(limit);
    const total = await Event.countDocuments(query);
    
    const events = await Event.find(query)
      .skip(startIndex)
      .limit(Number(limit))
      .sort({ startDate: 1 })
      .populate('organizationId', 'name logo');

    res.json({
      success: true,
      data: events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured events
// @route   GET /api/v1/events/featured
// @access  Public
const getFeaturedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: 'PUBLISHED', isFeatured: true })
      .limit(5)
      .populate('organizationId', 'name logo');

    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event by ID
// @route   GET /api/v1/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizationId', 'name description logo website')
      .populate('organizerId', 'name profileImage');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/v1/events
// @access  Private (ORGANIZER)
const createEvent = async (req, res, next) => {
  try {
    if (!req.user.organizationId) {
      return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
    }

    const event = await Event.create({
      ...req.body,
      organizerId: req.user._id,
      organizationId: req.user.organizationId
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Get organizer's events
// @route   GET /api/v1/events/my-events
// @access  Private (ORGANIZER)
const getMyEvents = async (req, res, next) => {
  try {
    if (!req.user.organizationId) {
      return res.status(403).json({ success: false, message: 'User does not belong to an organization' });
    }

    const events = await Event.find({ organizationId: req.user.organizationId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish event
// @route   POST /api/v1/events/:id/publish
// @access  Private (ORGANIZER)
const publishEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Verify ownership
    if (event.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    event.status = 'PUBLISHED';
    await event.save();

    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for event
// @route   POST /api/v1/events/:eventId/register
// @access  Private (PARTICIPANT)
const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    if (!event || event.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, message: 'Event not found or not published' });
    }

    if (event.capacity > 0 && event.registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is at full capacity' });
    }

    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
    }

    const existingRegistration = await Registration.findOne({ userId: req.user._id, eventId });
    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }

    // Create unique ticket code
    const ticketCode = `TKT-${eventId.toString().slice(-4).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create Registration and Ticket atomically if possible, but sequential for now
    const registration = await Registration.create({
      userId: req.user._id,
      eventId
    });

    const ticket = await Ticket.create({
      ticketCode,
      userId: req.user._id,
      eventId,
      registrationId: registration._id
    });

    registration.ticketId = ticket._id;
    await registration.save();

    event.registeredCount += 1;
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        registration,
        ticket
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign volunteer to event
// @route   POST /api/v1/events/:eventId/volunteers
// @access  Private (ORGANIZER)
const assignVolunteer = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { volunteerId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this event' });
    }

    const volunteer = await User.findById(volunteerId);
    if (!volunteer || volunteer.role !== 'VOLUNTEER') {
      return res.status(400).json({ success: false, message: 'User is not a volunteer' });
    }

    if (event.volunteers.includes(volunteerId)) {
      return res.status(400).json({ success: false, message: 'Volunteer already assigned' });
    }

    event.volunteers.push(volunteerId);
    await event.save();

    res.json({ success: true, message: 'Volunteer assigned successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event analytics
// @route   GET /api/v1/events/:eventId/analytics
// @access  Private (ORGANIZER)
const getEventAnalytics = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this event' });
    }

    const totalRegistrations = await Registration.countDocuments({ eventId });
    const totalCheckins = await Checkin.countDocuments({ eventId });
    const totalTickets = await Ticket.countDocuments({ eventId });
    const activeTickets = await Ticket.countDocuments({ eventId, status: 'ACTIVE' });
    const usedTickets = await Ticket.countDocuments({ eventId, status: 'USED' });
    
    const checkinPercentage = totalRegistrations > 0 ? ((totalCheckins / totalRegistrations) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        capacity: event.capacity,
        totalRegistrations,
        totalTickets,
        activeTickets,
        usedTickets,
        totalCheckins,
        checkinPercentage: parseFloat(checkinPercentage)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getFeaturedEvents,
  getEventById,
  createEvent,
  getMyEvents,
  publishEvent,
  registerForEvent,
  assignVolunteer,
  getEventAnalytics
};
