const express = require("express");
const router = express.Router();
const moment = require("moment");

//import modal
const User = require("../models/User");
const Menu = require("../models/Menu");
const Booking = require("../models/Bookings");

//middleware
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyToken = require("../middleware/verifyToken");

//get all bookings
router.get("/", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const tours = await Menu.countDocuments();
    const bookings = await Booking.countDocuments();

    // Get the current date and the past seven days
    const currentDate = moment().startOf("day");
    const sevenDaysAgo = moment().subtract(7, "days").startOf("day");

    // Filter bookings based on the current date and past seven days
    const bookingsToday = await Booking.countDocuments({
      created_At: { $gte: currentDate.toDate() },
    });
    const bookingsPastSevenDays = await Booking.countDocuments({
      created_At: { $gte: sevenDaysAgo.toDate(), $lte: currentDate.toDate() },
    });

    const result = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price",
          },
        },
      },
    ]);

    const revenue = result.length > 0 ? result[0].totalRevenue : 0;
    res.status(200).json({
      users,
      tours,
      bookings,
      revenue,
      bookingsToday,
      bookingsPastSevenDays,
    });
  } catch (error) {
    res.status(500).send("Internal server error: " + error.message);
  }
});

module.exports = router;
