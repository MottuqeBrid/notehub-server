const mongoose = require("mongoose");
const { Schema } = mongoose;

const RefreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d", // Automatically delete after 7 days
  },
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
