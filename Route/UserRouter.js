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

router.post("/signup", signupMiddleware, signupController);

// gate data by token
router.get("/me", refreshTokenMiddleware, meController);

router.post("/login", loginController);

// Logout route
router.patch("/logout", logoutController);

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
