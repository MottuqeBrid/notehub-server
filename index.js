const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// internal imports
const TodoRouter = require("./Route/TodoRouter");
const UserRouter = require("./Route/UserRouter");
const Todo = require("./Schema/TodoSchema");

const app = express();

// ["https://notehub-gray.vercel.app/", "http://localhost:5173"]
app.use(
  cors({
    origin: ["https://notehub-gray.vercel.app/", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

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
app.use("/user", UserRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
});

// vercel --prod
