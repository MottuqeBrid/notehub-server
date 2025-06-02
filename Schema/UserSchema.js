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
    cv: {
      type: String,
    },
    photo: {
      profilePicture: {
        type: String,
      },
      coverPhoto: {
        type: String,
      },
      profileBanner: {
        type: String,
      },
      profileVideo: {
        type: String,
      },
      profileAudio: {
        type: String,
      },
    },
    birthday: {
      type: Date,
    },
    about: {
      type: String,
    },
    address: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    country: {
      type: String,
    },
    maritalStatus: {
      type: String,
      enum: ["married", "unmarried"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    pronouns: {
      type: String,
      enum: ["he/him", "she/her", "they/them"],
    },
    hobbies: {
      type: String,
    },
    languages: {
      type: String,
    },
    interests: {
      type: String,
    },
    favorite: {
      favoriteBooks: {
        type: String,
      },
      favoriteMovies: {
        type: String,
      },
      favoriteShows: {
        type: String,
      },
      favoriteMusic: {
        type: String,
      },
      favoriteGames: {
        type: String,
      },
      favoriteSports: {
        type: String,
      },
      favoriteFood: {
        type: String,
      },
      favoritePlaces: {
        type: String,
      },
      favoriteActivities: {
        type: String,
      },
      favoriteQuotes: {
        type: String,
      },
      favoriteAuthors: {
        type: String,
      },
      favoriteArtists: {
        type: String,
      },
    },
    achievements: {
      type: String,
    },
    awards: {
      type: String,
    },
    certifications: {
      type: String,
    },
    projects: {
      type: String,
    },
    publications: {
      type: String,
    },
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
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    zipCode: {
      type: String,
    },
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
  employeeId: {
    type: String,
  },

  education: {
    studentId: {
      type: String,
    },
    school: {
      type: String,
    },
    college: {
      name: {
        type: String,
      },
      year: {
        type: String,
      },
    },
    degree: {
      type: String,
    },
    university: {
      name: {
        type: String,
      },
      department: {
        type: String,
      },
      year: {
        type: String,
      },
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

const User = mongoose.model("User", userSchema);
module.exports = User;
