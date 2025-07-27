const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingControllers");
const Bookings = require("../models/Bookings");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
// Route to create a new booking
router.post("/", bookingController.createBooking);

// Route to update a booking by ID
router.get("/", verifyToken, bookingController.getBookingByEmail);

router.get("/isBooked", verifyToken, bookingController.isTourBookedByUser);

// Route to get all bookings
router.get("/all", verifyToken, verifyAdmin, bookingController.getAllBookings);

// Route to delete a booking by ID
router.delete("/del/:id", bookingController.deleteBookingById);

// Route to get a single booking by ID
//router.get("/:id", verifyToken, bookingController.getBookingById);

module.exports = router;
