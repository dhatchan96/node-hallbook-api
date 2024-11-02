const express = require('express');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');

const app = express();
app.use(express.json());

// API Routes
app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes);

module.exports = app;
