const Bookings = require("../models/Bookings");
const sendEmail = require("../emailService");

const createBooking = async (req, res) => {
  const booking = req.body;

  try {
    console.log(booking);
    const bookingRequest = await Bookings.create(booking);

    const mailData = {
      from: "rohan110620@gmail.com", // sender address
      to: booking.email, // list of receivers
      subject: `Booking Confirmed with Tourista.`,
      text: "Thank you for choosing Tourista.",
      html: `<h2>Dear ${booking.name || "User"}</h2>
      <br> Your ${booking.tour_info?.Days?.length || 0} day tour for ${
        booking.tour_info?.name || "Unknown destination"
      } is booked. 
    <br>
<div style="text-align:center;justify-content:space-around;">
    <h2>Tour Info</h2>
    ${
      booking.adultTravellers && booking.adultTravellers.length > 0
        ? `
       <h3 style="margin:5px;">Adult Travellers</h3>
      <table style="width: 60%; margin: 0 auto; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background: linear-gradient(to right, #6366f1, #a78bfa, #6366f1);">Name</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background: linear-gradient(to right, #6366f1, #a78bfa, #6366f1);">Age</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background: linear-gradient(to right, #6366f1, #a78bfa, #6366f1);">Gender</th>
          </tr>
        </thead>
        <tbody>
          ${booking.adultTravellers
            .map((aT) => {
              return `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${aT.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${aT.age}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${aT.gender}</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    `
        : `<p></p>`
    }
  
 ${
   booking.childTravellers && booking.childTravellers.length > 0
     ? `
      <h3 style="margin:5px;">Child Travellers</h3>
      <table border="1" cellpadding="10" style="border-collapse: collapse; width: 60%; margin: 0 auto;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;background: linear-gradient(to right, #6366f1, #a78bfa, #6366f1);">Name</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;background: linear-gradient(to right, #6366f1, #a78bfa, #6366f1);">Age</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;background: linear-gradient(to right, #6366f1, #a78bfa, #6366f1);">Gender</th>
          </tr>
        </thead>
        <tbody>
          ${booking.childTravellers
            .map((aT) => {
              return `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${aT.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${aT.age}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${aT.gender}</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    `
     : `<p></p>`
 }
    </div>
    <br/> We look forward to hosting you!`,
    };

    const result = await sendEmail(mailData);
    if (result) {
      console.log("Email sent successfully:");
      res.status(201).json(bookingRequest);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get bookings by email
const getBookingByEmail = async (req, res) => {
  const email = req.query.email;
  //console.log(email);
  try {
    const decodedEmail = req.decoded.email;
    if (email !== decodedEmail) {
      //console.log(decodedEmail);
      return res.status(403).json({ message: "Forbidden access" });
    }
    const yourBookings = await Bookings.find({ email })
      .sort({ created_At: -1 })
      .exec();
    res.status(200).json(yourBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//getAllbookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find();
    console.log(bookings);
    res.status(201).json(bookings);
  } catch {
    res.status(500).json({ error: error.message });
  }
};

//deleteBooking by id
const deleteBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const DeleteBooking = await Bookings.findByIdAndDelete(id);
    if (!DeleteBooking) {
      return res.status(404).json({
        message: "Booking not deleted",
      });
    }
    res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getBookingByEmail,
  getAllBookings,
  deleteBookingById,
};
