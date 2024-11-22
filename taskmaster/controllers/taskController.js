// basic CRUD routes for managing tasks.

const Task = require("../models/Task");

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, priority, deadline } = req.body;
  const newTask = new Task({
    userId: req.user.id,
    title,
    description,
    priority,
    deadline,
  });
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
};

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Update an existing task
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id; // Extracted from `auth` middleware

    // Check if the task exists and belongs to the user
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only update fields that are provided in the request body
    const allowedUpdates = ["title", "description", "deadline", "priority"];
    const updates = Object.keys(req.body);

    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid update fields" });
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    // Save updated task
    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
};

// Filter tasks by priority or due date
exports.filterTasks = async (req, res) => {
  const { priority, dueDate } = req.query;
  const filter = { userId: req.user.id };

  if (priority) filter.priority = priority;
  if (dueDate) filter.deadline = { $lte: new Date(dueDate) };

  try {
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching filtered tasks" });
  }
};
