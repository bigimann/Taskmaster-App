//  const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//     title: {type: String, required: true},
//     description: {type: String, required: true},
//     deadline: {type: Date, required: true},
//     priority: {type: String, enum: ['Low', 'Medium', 'High'], required: true}
// })

const mongoose = require("mongoose");



const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  priority: { type: String, required: true, enum: ["low", "medium", "high"] },
});

const Task = mongoose.model('task', taskSchema)

module.exports = Task;
