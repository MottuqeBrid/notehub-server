const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Note", "Link", "Todo", "other"],
    required: true,
    default: "Note",
  },
  description: {
    type: String,
  },
  todoItems: [
    {
      text: String,
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  link: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: [
    {
      type: Date,
      default: Date.now,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isShared: {
    type: Boolean,
    default: false,
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  color: {
    type: String,
    default: "#ffffff", // Default color can be set to white or any other color
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  reminder: {
    type: Date,
  },
});
const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
