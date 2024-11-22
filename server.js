const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const tasksRoute = require("./taskmaster/routes/task");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

const allowedOrigins = ["https://taskmaster-app-seven.vercel.app"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON bodies
app.use("/tasks", tasksRoute);

mongoose
  .connect(process.env.MONGO_URI)
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
