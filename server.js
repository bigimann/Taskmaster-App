const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const tasksRoute = require("./taskmaster/routes/task");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use("/tasks", tasksRoute);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.get("/", (req, res) => {
  res.send("Testing my server configuration");
});

// Routes for handling authentication
const authController = require("./taskmaster/controllers/authController");
app.post("/register", authController.register);
app.post("/login", authController.login);

module.exports = app; // Export the app for testing
