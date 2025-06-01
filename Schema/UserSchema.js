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
  bio: {
    type: String,
  },
  location: {
    type: String,
  },

  socialLinks: {
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  securityQuestions: [
    {
      question: {
        type: String,
      },
      answer: {
        type: String,
      },
    },
  ],
  studentId: {
    type: String,
  },
  employeeId: {
    type: String,
  },
  department: {
    type: String,
  },
  education: {
    school: {
      type: String,
    },
    collage: {
      type: String,
    },
    degree: {
      type: String,
    },
    university: {
      type: String,
    },
    year: {
      type: String,
    },
  },
  skills: {
    type: String,
  },
  job: {
    company: {
      type: String,
    },
    title: {
      type: String,
    },
    location: {
      presentAddress: {
        type: String,
      },
      permanentAddress: {
        type: String,
      },
      city: {
        type: String,
      },
      workLocation: {
        type: String,
      },
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// module.exports = mongoose.model("User", userSchema);

const User = mongoose.model("User", userSchema);
module.exports = User;
