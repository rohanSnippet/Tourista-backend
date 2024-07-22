const UserQuery = require("../models/UserQuery");
const nodemailer = require("nodemailer");
require("dotenv").config();

//Get emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

//get welcome email
//get query by email for user
/* const getQueryByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    const query = { email: email };
    const result = await Carts.find(query).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */

//Store query in database
const createQuery = async (req, res) => {
  try {
    const { email, name, question, feedback } = req.body;
    console.log(email, name, question, feedback);

    // Attempt to create a new document
    const result = await UserQuery.create({ email, name, question, feedback });
    console.log("Query created successfully:", result);

    // Send email if document creation is successful
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "Your Subject Here",
      text: feedback,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    res.status(200).json(result);
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000 && error.keyPattern.email === 1) {
      return res.status(400).json({ message: "Email address already exists" });
    }

    console.error("Error creating query:", error);
    res
      .status(500)
      .json({ message: "Error creating query", error: error.message });
  }
};

//getAllQueries for admin
const getAllQueries = async (req, res) => {
  try {
    const result = await UserQuery.find().exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  // getQueryByEmail,
  createQuery,
  getAllQueries,
  transporter,
};
