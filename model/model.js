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


//new connection 


const connectionSchema= new mongoose.Schema({
  requestedBy:String,
 persons:[Object],
 status:String
})

const UserConections=mongoose.model("all_connection",connectionSchema)


const messageSchema= new mongoose.Schema({
  connect_Id:String,
  msgData:{email:String,message:String}
})

const MessageModel=mongoose.model('all_message',messageSchema)

//export model
module.exports = {  Users, Project,UserConections,MessageModel };
