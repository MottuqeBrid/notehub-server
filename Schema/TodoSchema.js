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
      _id: false,
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
});
const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
