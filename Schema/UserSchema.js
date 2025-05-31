const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  userType: {
    type: String,
    enum: ["admin", "user", "guest", "superadmin", "moderator"],
    default: "user",
  },
  otp: [
    {
      type: String,
    },
  ],
  todo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
  isVerified: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  profilePicture: {
    type: String,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now,
  },
  lastLogout: {
    type: Date,
    default: Date.now,
  },
  lastPasswordReset: {
    type: Date,
    default: Date.now,
  },
  coverPage: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cover",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// module.exports = mongoose.model("User", userSchema);

const User = mongoose.model("User", userSchema);
module.exports = User;
