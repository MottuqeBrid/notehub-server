const express = require("express");
const router = express.Router();
const Todo = require("../Schema/TodoSchema");
const Cover = require("../Schema/CoverSchema");
const User = require("../Schema/UserSchema");

router.get("/all", async (req, res) => {
  try {
    const covers = await Cover.find();
    res.status(200).json(covers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch covers" });
  }
});
router.post("/add", async (req, res) => {
  try {
    const newCover = new Cover(req.body);
    const savedCover = await newCover.save();
    const user = await User.findById(req.body.user);
    user.coverPage.push(savedCover._id);
    await user.save();
    res.status(201).json(savedCover);
  } catch (error) {
    res.status(500).json({ error: "Failed to add cover" });
  }
});

module.exports = router;
