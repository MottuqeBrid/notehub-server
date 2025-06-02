// external import
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// internal imports
const User = require("../Schema/UserSchema");
const RefreshToken = require("../Schema/RefreshTokenSchema");
const isProduction = process.env.NODE_ENV === "production";

// loin
const loginController = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const refreshToken = jwt.sign(
        { id: user._id, role: user.userType },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );

      const token = await jwt.sign(
        { id: user._id, role: user.userType },
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
      } = user;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      res
        .status(201)
        .cookie("token", token, {
          path: "/",
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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
};

// logout
const logoutController = async (req, res) => {
  const token = req.cookies?.refreshToken;
  // Destroy the session
  await User.findByIdAndUpdate(req.body._id, {
    $set: { lastLogout: new Date(), isActive: false },
  });
  console.log(req.body);
  const refreshToken = new RefreshToken({
    token: token,
    userId: req.body?.user?._id,
  });
  await refreshToken.save();
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    })
    .json({ success: true, message: "Logged out and all cookies cleared!" });
};

// signup
const signupController = async (req, res) => {
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
    const refreshToken = jwt.sign(
      { id: newUser._id, role: newUser.userType },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    const token = jwt.sign(
      { id: result._id, role: result.userType },
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
    } = result;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // sameSite: "strict",
      secure: isProduction,
      // sameSite: "None", // ✅ cross-site হলে none দিন
      sameSite: isProduction ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res
      .status(201)
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        // sameSite: "strict", // Adjust based on your needs
        secure: isProduction,
        // sameSite: "None", // ✅ cross-site হলে none দিন
        sameSite: isProduction ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        // secure: process.env.NODE_ENV === "production", // ✅ production এ secure=true
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
};

// me controller
const meController = async (req, res) => {
  const token = req.token;
  const id = req.userId;
  if (!token) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }
  try {
    const user = await User.findById(id).select("-password -otp");
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
};
module.exports = {
  loginController,
  logoutController,
  signupController,
  meController,
};
