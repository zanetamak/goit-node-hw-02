const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerificationEmail = async ({ email, verificationToken }) => {
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    api_key: process.env.SEND_GRID_API_KEY,
  },
});

  const emailOptions = {
    from: "zaneta.zawislak@gmail.com",
    to: "zaneta.zawislak@gmail.com",
    subject: "Please verify your email",
    text: `Verify your email: http://localhost:3000/users/verify/${verificationToken}`
  };

  try {
    const info = await transporter.sendMail(emailOptions);
    console.log(info);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendVerificationEmail;