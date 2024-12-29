const UserQuery = require("../models/UserQuery");
const sendEmail = require("../emailService");

//Store query in database
const createQuery = async (req, res) => {
  const { email, name, question, feedback } = req.body;

  // Validate incoming data
  if (!email || !name || !question) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await UserQuery.create({ email, name, question, feedback });
    console.log("Query created successfully:", result);

    const mailData = {
      from: result.email,
      to: "rohan110620@gmail.com",
      subject: question,
      text: feedback,
      html: `<h2>Dear Admin,</h2><br>
      <p>You have a query from ${name}</p><br>
     <p>Email: <strong>${email}</strong></p><br>
      <p>Question: <strong>${question}</strong></p><br>
      <p>Feedback: <strong>${feedback}</strong></p>`,
    };
    const emailQuery = await sendEmail(mailData);
    console.log(emailQuery);
    res.status(200).json(result);
  } catch (error) {
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
  createQuery,
  getAllQueries,
};
