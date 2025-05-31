const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
// const mongoose = require("mongoose");
const Todo = require("../Schema/TodoSchema");

router.get("/all", async (req, res) => {
  // console.log(req.cookies.token);
  if (!req.cookies.token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = await jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const todos = await Todo.find({ userId: decoded.id, isDeleted: false });
    res.status(200).json(todos.reverse());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

router.put("/update", async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          todoItems: req.body.todoItems,
          completed: req.body.completed,
        },
      }
    );
    res.send(todo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to Update todo" });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    const todo = await Todo.findByIdAndDelete(req.params.id);
    res.send(todo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

router.post("/add", async (req, res) => {
  if (!req.body.userId) {
    return res
      .status(400)
      .json({ success: false, error: "userId is required" });
  }

  try {
    const newTodo = new Todo({ ...req.body });
    const result = await newTodo.save();
    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

module.exports = router;
