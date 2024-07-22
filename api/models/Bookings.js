const mongoose = require("mongoose");

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  transaction_id: String,
  email: String,
  phone: String,
  price: Number,
  travellers: Number,
  adultTravellers: Array,
  childTravellers: Array,
  tour_info: Array,
  created_At: {
    type: Date,
    default: Date.now,
  },
});

// Define the Booking model
const Bookings = mongoose.model("Booking", bookingSchema);

module.exports = Bookings;
