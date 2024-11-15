const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");

// Task management routes
router.post("/", auth, taskController.createTask); // Create task
router.get("/", auth, taskController.getTasks); // Get all tasks
router.put("/:id", auth, taskController.updateTask); // Update task
router.delete("/:id", auth, taskController.deleteTask); // Delete task
router.get("/filter", auth, taskController.filterTasks); // Filter tasks by priority or due date

module.exports = router;
