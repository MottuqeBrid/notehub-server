const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// internal imports
const TodoRouter = require("./Route/TodoRouter");
const Todo = require("./Schema/TodoSchema");

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/todo", TodoRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
});
