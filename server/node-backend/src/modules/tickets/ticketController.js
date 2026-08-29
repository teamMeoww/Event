const Ticket = require('../../models/Ticket');
const jwt = require('jsonwebtoken');

// @desc    Get logged in user's tickets
// @route   GET /api/v1/tickets/my-tickets
// @access  Private
const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id })
      .populate('eventId', 'title startDate endDate coverImage venue')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket by ID
// @route   GET /api/v1/tickets/:id
// @access  Private
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('eventId', 'title startDate endDate coverImage venue')
      .populate('userId', 'name email profileImage');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Allow owner or organizer/admin
    if (ticket.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'ORGANIZER' && req.user.role !== 'VOLUNTEER') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic QR code for ticket
// @route   GET /api/v1/tickets/:id/qr
// @access  Private
const getTicketQR = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to get this QR' });
    }

    if (ticket.status !== 'ACTIVE' && ticket.status !== 'MINTED') {
      return res.status(400).json({ success: false, message: `Ticket is ${ticket.status}` });
    }

    // Generate short-lived signed QR token
    const qrPayload = {
      ticketId: ticket._id,
      userId: ticket.userId,
      eventId: ticket.eventId,
      type: 'EVENTONE_CHECKIN_QR'
    };

    const qrToken = jwt.sign(qrPayload, process.env.QR_TOKEN_SECRET, {
      expiresIn: process.env.QR_TOKEN_EXPIRES_IN || '60s'
    });

    res.json({ 
      success: true, 
      data: {
        qrToken,
        expiresIn: process.env.QR_TOKEN_EXPIRES_IN || '60s'
      } 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyTickets,
  getTicketById,
  getTicketQR
};
