const mongoose = require("mongoose");



//new task
const taskSchema = new mongoose.Schema({
  task_name: String,
  description: String,
  date: String,
  assign: String,
});
const Task = mongoose.model("allTask", taskSchema);

//new user
const newUserSchema= new mongoose.Schema({
    email:String,
    name:String,
    mobile:String,
    role:String,
})
const Users = mongoose.model("allUsers", newUserSchema)



//export model
module.exports = { Task,Users };