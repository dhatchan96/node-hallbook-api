const express = require('express');
const { rooms, bookings } = require('../data'); // Import shared arrays

const router = express.Router();

/**
 * Check if a room is available for booking at the specified date and time
 * @param {Number} roomId - ID of the room to book
 * @param {String} date - Booking date
 * @param {String} startTime - Start time of booking
 * @param {String} endTime - End time of booking
 * @returns {Boolean} - Returns true if room is available, false otherwise
 */
function isRoomAvailable(roomId, date, startTime, endTime) {
  return !bookings.some(booking => 
    booking.roomId === roomId &&
    booking.date === date &&
    (
      (startTime >= booking.startTime && startTime < booking.endTime) ||
      (endTime > booking.startTime && endTime <= booking.endTime)
    )
  );
}

// Book a room
router.post('/', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;

  // Check if the room is available
  if (!isRoomAvailable(roomId, date, startTime, endTime)) {
    return res.status(400).json({ message: "Room is already booked for the specified date and time." });
  }

  const newBooking = { id: bookings.length + 1, customerName, date, startTime, endTime, roomId, status: 'booked' };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// List all customers with booked data
router.get('/customers/booked', (req, res) => {
  const customerBookings = bookings.map(booking => {
    const room = rooms.find(room => room.id === booking.roomId);
    return { ...booking, roomName: room ? room.name : "Room not found" };
  });
  res.json(customerBookings);
});

// List booking history for a specific customer
router.get('/customers/:customerName/history', (req, res) => {
  const customerName = req.params.customerName;
  const customerHistory = bookings
    .filter(booking => booking.customerName === customerName)
    .map(booking => {
      const room = rooms.find(room => room.id === booking.roomId);
      return { ...booking, roomName: room ? room.name : "Room not found" };
    });
  res.json(customerHistory);
});

module.exports = router;
