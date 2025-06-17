const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../Schema/UserSchema");
const {
  signupMiddleware,
  verifyToken,
  refreshTokenMiddleware,
} = require("../middleware/userMiddleware");
const RefreshToken = require("../Schema/RefreshTokenSchema");
const {
  loginController,
  logoutController,
  signupController,
  meController,
} = require("../controller/UserController");
const { sendOTP } = require("../mailer");

router.post("/signup", signupMiddleware, signupController);

// gate data by token
router.get("/me", refreshTokenMiddleware, meController);
router.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select(
      "-password -otp  -__v -createdAt   -isActive   -securityQuestions"
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});
router.patch("/update-profile", refreshTokenMiddleware, async (req, res) => {
  const userId = req.userId; // from refreshTokenMiddleware
  // (userId);

  try {
    const user = await User.findByIdAndUpdate(userId, { ...req.body });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

router.post("/login", loginController);

// Logout route
router.patch("/logout", logoutController);

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP
router.patch("/otp", verifyToken, async (req, res) => {
  const id = req.userId;
  const otp = generateOTP();

  const hashedOtp = await bcrypt.hash(otp, 10);
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  user.otp.push(hashedOtp);
  await user.save();
  try {
    await sendOTP(user.email, otp);
    res.json({ success: true, message: "OTP sent via email" });
  } catch {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }

  // res.status(200).json({ success: true, message: "OTP sent" });
});

// ✅ Verify OTP
router.patch("/verify", verifyToken, async (req, res) => {
  const { otp } = req.body;
  const id = req.userId;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  if (!user.otp || user.otp.length === 0) {
    return res.status(400).json({ success: false, message: "No OTP sent" });
  }
  const verifyOtp = await user.otp.filter((ot) => {
    bcrypt.compare(otp, ot).then((isMatch) => {
      if (isMatch) {
        return true; // Keep the matching OTP
      }
      return null; // Filter out non-matching OTPs
    });
  });

  if (!verifyOtp) {
    return res.status().json({ success: false, message: "Invalid OTP" });
  }
  user.isVerified = true; // Set user as verified
  await user.save();

  res.status(200).json({ success: true, message: "OTP verified" });
});

router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // invalid refresh token

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role }, // user data from refresh token
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "1h" } // default to 1 hour if not set
    );

    res.json({ accessToken: newAccessToken });
  });
});

module.exports = router;
