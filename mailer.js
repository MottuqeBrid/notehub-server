const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendOTP = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Secure Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: sans-serif;">
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h3 style="color: #4f46e5; letter-spacing: 2px;">${otp}</h3>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email not sent");
  }
};
module.exports = { sendOTP };
