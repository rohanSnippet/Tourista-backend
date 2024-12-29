const sendEmail = require("../api/emailService");

const testEmail = async () => {
  const mailData = {
    from: "rohan110620@gmail.com", // Replace with your verified sender address
    to: "namesrohan@gmail.com", // Replace with the recipient's email address
    subject: "Test Email",
    text: "This is a test email",
    html: "<b>This is a test email</b>",
  };

  const result = await sendEmail(mailData);
  console.log("Email send result:", result);
};

testEmail();
