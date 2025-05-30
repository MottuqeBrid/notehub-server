const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const Todo = require("../Schema/TodoSchema");

router.get("/all", async (req, res) => {
  try {
    const todos = await Todo.find();
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
  console.log("add todo", req.body);
  try {
    const newTodo = new Todo({ ...req.body });
    const result = await newTodo.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

module.exports = router;
