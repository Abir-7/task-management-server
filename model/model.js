const mongoose = require("mongoose");






//new project
const projectSchema = new mongoose.Schema({
  projectName: String,
  description: String,
  date: String,
  isCompleted: Boolean,
  allTask:Array
});

const Project = mongoose.model("AllProject", projectSchema);
//new user
const newUserSchema = new mongoose.Schema({
  email: String,
  name: String,
  mobile: String,
  role: String,
  photoURL:String,
});
const Users = mongoose.model("allUsers", newUserSchema);

//export model
module.exports = {  Users, Project };
