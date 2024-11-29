const Task = require('../model/Task')

module.exports.create = async (req, res) => {
  const { title, description, deadline, priority } = req.body;

  if (!title || !description || !deadline || !priority) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const task = await Task.create({ title, description, deadline, priority });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

module.exports.getAll = async (req, res) => {
    try {
      const tasks = await Task.find(); // Ensure this is an await, since it's asynchronous.
      if (tasks.length === 0) {
        return res.status(200).json({ message: 'No tasks found', tasks: [] }); // Return empty array
      }
      return res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      return res.status(500).json({ error: "An error occurred while fetching tasks" });
    }
  };
  


  module.exports.getTaskByTitle = async (req, res) => {
    try {
      const title = decodeURIComponent(req.params.title); // Decode special characters
      const task = await Task.findOne({ title });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task); // Return the task data
    } catch (error) {
      console.error("Error fetching task:", error.message);
      res.status(500).json({ error: "An error occurred while fetching the task" });
    }
  };

module.exports.update = async (req, res) => {
    const { id } = req.params;
  const { title, description, deadline, priority } = req.body;

  try {

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, deadline, priority },
      { new: true } // Return the updated document
    );

    // Handle task not found
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Return success response
    res.status(200).json({
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error) {
    // Handle errors
    console.error("Error updating task:", error);
    res.status(500).json({ error: error.message });
  }
};



module.exports.delete = async (req, res) => {
    const { id } = req.params; // Use id from the route params
  
    try {
      const task = await Task.findByIdAndDelete(id); // Match by ID directly
  
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error("Error deleting task:", error);
    }
  };
  
  

