require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoute = require("./routes/task.routes");
const userRoute = require("./routes/user.routes");

// const port = 3000;
const port = process.env.PORT || 8080;
const app = express();
const uri = process.env.MONGO_URI;

// Middleware
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

app.use(express.json()); // Parse JSON requests

// Routes
app.use("/tasks", taskRoute);
app.use("/users", userRoute);

mongoose
  .connect(uri)
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });

app.get("/", (req, res) => {
  res.send("Hello, welcome to my API");
});
