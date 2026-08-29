const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getFeaturedEvents, 
  getEventById, 
  createEvent, 
  getMyEvents, 
  publishEvent,
  registerForEvent,
  assignVolunteer,
  getEventAnalytics,
  getPendingEvents,
  approveEvent
} = require('./eventController');
const { protect, authorize } = require('../../middleware/authMiddleware');
const { issueCredentials } = require('../credentials/credentialController');

router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);

// Admin routes
router.get('/admin/pending', protect, authorize('SUPER_ADMIN'), getPendingEvents);
router.put('/admin/:id/approve', protect, authorize('SUPER_ADMIN'), approveEvent);

// Organizer routes
router.post('/', protect, authorize('ORGANIZER'), createEvent);
router.get('/my/events', protect, authorize('ORGANIZER'), getMyEvents); // Switched to /my/events to avoid collision
router.post('/:id/publish', protect, authorize('ORGANIZER'), publishEvent);
router.post('/:eventId/volunteers', protect, authorize('ORGANIZER'), assignVolunteer);
router.get('/:eventId/analytics', protect, authorize('ORGANIZER'), getEventAnalytics);
router.post('/:eventId/credentials/issue', protect, authorize('ORGANIZER'), issueCredentials);

// Participant routes
router.post('/:eventId/register', protect, registerForEvent);

// ID Route must be last
router.get('/:id', getEventById);

module.exports = router;
