const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task_name:String,
    description:String,
    date:String,
    assign:String
});

const Task = mongoose.model('allTask', taskSchema)
module.exports = {Task}