const jwt = require('jsonwebtoken');
const Ticket = require('../../models/Ticket');
const Checkin = require('../../models/Checkin');
const Event = require('../../models/Event');

// @desc    Scan QR token and check in participant
// @route   POST /api/v1/checkin/scan
// @access  Private (VOLUNTEER or ORGANIZER)
const scanTicket = async (req, res, next) => {
  try {
    const { qrToken, eventId } = req.body;

    // 1 & 2. Handled by authMiddleware
    // 3. Verify scanner is assigned to event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (
      req.user.role === 'VOLUNTEER' && 
      !event.volunteers.includes(req.user._id)
    ) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this event' });
    }

    if (
      req.user.role === 'ORGANIZER' && 
      event.organizationId.toString() !== req.user.organizationId.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized for this organization\'s event' });
    }

    // 4 & 5. Verify QR token signature and expiration
    let decoded;
    try {
      decoded = jwt.verify(qrToken, process.env.QR_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'QR code is invalid or expired' });
    }

    if (decoded.type !== 'EVENTONE_CHECKIN_QR' || decoded.eventId !== eventId) {
      return res.status(400).json({ success: false, message: 'QR code is not for this event' });
    }

    // 6 & 7. Extract Ticket ID and find ticket
    const ticket = await Ticket.findById(decoded.ticketId);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // 8. Verify ticket belongs to requested event
    if (ticket.eventId.toString() !== eventId) {
      return res.status(400).json({ success: false, message: 'Ticket belongs to a different event' });
    }

    // 9, 10, 11. Verify ticket status
    if (ticket.status === 'USED') {
      return res.status(400).json({ success: false, message: 'Ticket has already been checked in', error: { code: 'ALREADY_CHECKED_IN' } });
    }

    if (ticket.status === 'CANCELLED' || ticket.status === 'REVOKED') {
      return res.status(400).json({ success: false, message: `Ticket is ${ticket.status.toLowerCase()}` });
    }

    // 13. Atomically create check-in (MongoDB unique index prevents duplicates)
    let checkin;
    try {
      checkin = await Checkin.create({
        ticketId: ticket._id,
        eventId: event._id,
        participantId: ticket.userId,
        volunteerId: req.user._id,
      });
    } catch (err) {
      if (err.code === 11000) {
         return res.status(400).json({ success: false, message: 'Ticket has already been checked in', error: { code: 'ALREADY_CHECKED_IN' } });
      }
      throw err;
    }

    // 14, 15, 16. Update ticket status
    ticket.status = 'USED';
    ticket.checkedInAt = checkin.checkedInAt;
    ticket.checkedInBy = req.user._id;
    await ticket.save();

    // 17. Emit real-time events (Socket.io)
    const io = req.app.get('io');
    if (io) {
      // Notify organizer dashboard
      io.to(`organization:${event.organizationId}`).emit('event_checkin_updated', {
        eventId: event._id,
        ticketId: ticket._id
      });
      // Notify participant app
      io.to(`user:${ticket.userId}`).emit('participant_checked_in', {
        eventId: event._id,
        ticketId: ticket._id
      });
    }

    // 18. Return successful response
    res.json({
      success: true,
      message: 'Check-in successful',
      data: checkin
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanTicket
};
