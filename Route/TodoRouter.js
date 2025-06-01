const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
// const mongoose = require("mongoose");
const Todo = require("../Schema/TodoSchema");

router.get("/all", async (req, res) => {
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
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const todo = await Todo.findOneAndUpdate(
      { _id: req.body._id, userId: decoded.id },
      {
        $set: {
          todoItems: req.body.todoItems,
          completed: req.body.completed,
        },
      },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to Update todo" });
  }
});
router.delete("/delete/:id", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: decoded.id },
      { isDeleted: true },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
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
