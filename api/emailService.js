const nodemailer = require("nodemailer");

const sendEmail = async (mailData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_MAIL || "tourista100@gmail.com", //"rohan110620@gmail.com",
        pass: process.env.SMTP_PASSWORD || "hxxwbowvodstxggq",//"jiunuoqcuoesxyah",
      },
    });
    await transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection failed:", error.message);
      } else {
        console.log("SMTP connection successful");
      }
    });

    const info = await transporter.sendMail(mailData);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;
  }
};

module.exports = sendEmail; // Make sure this is exported
