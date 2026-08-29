const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EventOne API is running' });
});

const authRoutes = require('./modules/auth/authRoutes');
const organizationRoutes = require('./modules/organizations/organizationRoutes');
const eventRoutes = require('./modules/events/eventRoutes');
const ticketRoutes = require('./modules/tickets/ticketRoutes');
const volunteerRoutes = require('./modules/volunteers/volunteerRoutes');
const checkinRoutes = require('./modules/checkins/checkinRoutes');
const notificationRoutes = require('./modules/notifications/notificationRoutes');
const credentialRoutes = require('./modules/credentials/credentialRoutes');

// Routes will be added here
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/volunteer', volunteerRoutes);
app.use('/api/v1/checkin', checkinRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/credentials', credentialRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;
