const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../Schema/UserSchema");
const {
  signupMiddleware,
  verifyToken,
} = require("../middleware/userMiddleware");

router.post("/signup", signupMiddleware, async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // Create a new user
    const newUser = new User({ ...req.body });
    const result = await newUser.save();
    // Generate a JWT token
    const token = jwt.sign(
      { id: result._id, email: result.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
    const {
      _id,
      email,
      name,
      userType,
      isVerified,
      isDeleted,
      isBlocked,
      isActive,
      profilePicture,
      ...rest
    } = result;

    res
      .status(201)
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        // secure: true, // for dev, not HTTPS
        sameSite: "strict", // Adjust based on your needs
        maxAge: 3600000, // 1 hour in milliseconds
      })
      .json({
        success: true,
        user: {
          _id,
          email,
          name,
          userType,
          isVerified,
          isDeleted,
          isBlocked,
          isActive,
          profilePicture,
        },
        token,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create user" });
  }
});

// gate data by token
router.get("/me", async (req, res) => {
  // const token = req.headers["authorization"];
  const token = req.cookies?.token;

  // const updateToken = token && token.split(" ")[1]; // Extract token from Bearer scheme
  // console.log(token);
  if (!token) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -otp");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const {
      _id,
      email,
      name,
      userType,
      isVerified,
      isDeleted,
      isBlocked,
      isActive,
      profilePicture,
      ...rest
    } = user;
    res.status(200).json({
      success: true,
      user: {
        _id,
        email,
        name,
        userType,
        isVerified,
        isDeleted,
        isBlocked,
        isActive,
        profilePicture,
      },
    });
  } catch (error) {
    res
      .status(403)
      .json({ success: false, error: "Failed to authenticate token" });
  }
});

router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = await jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRY,
        }
      );
      // Update last login time and isActive status
      await user.updateOne({
        $set: {
          lastLogin: Date.now(),
          isActive: true,
        },
      });
      const {
        _id,
        email,
        name,
        userType,
        isVerified,
        isDeleted,
        isBlocked,
        isActive,
        profilePicture,
        ...rest
      } = user;

      res
        .status(201)
        .cookie("token", token, {
          path: "/",
          httpOnly: true,
          // secure: true, // for dev, not HTTPS
          sameSite: "strict", // Adjust based on your needs
          maxAge: 3600000, // 1 hour in milliseconds
        })
        .json({
          user: {
            _id,
            email,
            name,
            userType,
            isVerified,
            isDeleted,
            isBlocked,
            isActive,
            profilePicture,
          },
          token,
          success: true,
        });
    } else {
      res.status(400).json({ success: false, error: "Invalid credentials" });
    }
  }
});

// Logout route
router.patch("/logout", async (req, res) => {
  // Destroy the session
  await User.findByIdAndUpdate(req.body._id, {
    $set: { lastLogout: new Date(), isActive: false },
  });

  res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      // secure: true, // depends on your app (set to true if using HTTPS)
      sameSite: "strict", // or "lax" depending on your needs
    })
    .json({ success: true, message: "Logged out and all cookies cleared!" });
});
module.exports = router;
