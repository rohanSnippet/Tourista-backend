const Bookings = require("../models/Bookings");
// Nodemailer
const nodemailer = require("nodemailer");

// SMTP Config
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Controller function to create a new booking
const createBooking = async (req, res) => {
  const booking = req.body;

  try {
    const bookingRequest = await Bookings.create(booking);

    const activitiesHTML = booking.tour_info.tour_includes
      .map((activity, i) => `<li key=${i}>${activity}</li>`)
      .join(" ");

    // Send email to the user
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: booking.email,
      subject: "Tourista Booking Confirmation",
      text: "hello",
      html: `
      
      <table style="max-width: 600px; margin: 0 auto; border-collapse: collapse; font-family: Arial, sans-serif;" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333; margin-bottom: 20px; text-align: center;">Your TOURISTA Tour Booking Confirmation</h1>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="background-color: #f3ece6; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <p>Dear ${booking.name},</p>
                <p>We are excited to confirm your booking with TOURISTA. Below are your booking details:</p>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Booking ID:</strong> ${booking.transaction_id}</li>
                  <li><strong>Tour:</strong> ${booking.tour_info.name}</li>
                  <li><strong>Number of Travelers:</strong> ${booking.travellers}</li>
                </ul>
              </td>
            </tr>
          </table>
    
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="background-color: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <p>Booking Details:</p>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Tour Name:</strong> ${booking.tour_info.name}</li>
                  <li><strong>Start Date:</strong> ${booking.tour_info.start_date}</li>
                  <li><strong>End Date:</strong> ${booking.tour_info.end_date}</li>
                  <li><strong>Tour Includes:</strong> ${activitiesHTML}</li>
                  <li><strong>Price:</strong> &#x20B9; ${booking.price}</li>
                </ul>
              </td>
            </tr>
          </table>
    
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="background-color: #f2f3f5; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <p>If you need any assistance or have questions, please don't hesitate to reach out to us at <a href="mailto:Tourista@gmail.com" style="color: #008000; text-decoration: none;">Tourista@gmail.com</a></p>
              </td>
            </tr>
          </table>
    
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="background-color: #a87a63; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <p>Thank you for choosing TOURISTA! We can't wait to make your tour unforgettable.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
     
   
       `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    res.status(200).json(result);
    res.status(201).json(bookingRequest);
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
  console.log(id);
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
// Controller function to get a single booking by ID
/* const getBookingById = async (req, res) => {
  const bookedTour = req.params.id;
  try {
    const booking = await Bookings.findById(bookedTour);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */

module.exports = {
  createBooking,
  getBookingByEmail,
  getAllBookings,
  //getBookingById,
  //updateBookingById,
  deleteBookingById,
};
