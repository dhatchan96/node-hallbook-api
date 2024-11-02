const express = require('express');
const { rooms, bookings } = require('../data'); // Import shared arrays

const router = express.Router();

// Create a new room
router.post('/', (req, res) => {
  const newRoom = { id: rooms.length + 1, ...req.body };
  rooms.push(newRoom);
  res.status(201).json(newRoom);
});

// List all rooms with booking data
router.get('/booked', (req, res) => {
  const roomsWithBookings = rooms.map(room => {
    const bookingsForRoom = bookings.filter(booking => booking.roomId === room.id);
    return { ...room, bookings: bookingsForRoom };
  });
  res.json(roomsWithBookings);
});

module.exports = router;
