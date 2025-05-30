const mongoose = require("mongoose");
const { create } = require("./TodoSchema");

const coverSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  courseTitle: {
    type: String,
  },
  section: {
    type: String,
  },
  courseCode: {
    type: String,
  },
  studentName: {
    type: String,
  },
  studentId: {
    type: String,
  },
  year: {
    type: String,
  },
  term: {
    type: String,
  },
  teacherName: {
    type: String,
  },
  studentDiscipline: {
    type: String,
  },
  teacherDiscipline: {
    type: String,
  },
  degree: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  studentInstitute: {
    type: String,
  },
  teacherInstitute: {
    type: String,
  },
  coverType: {
    type: String,
  },
  Category: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// module.exports = coverSchema;
module.exports = mongoose.model("Cover", coverSchema);
