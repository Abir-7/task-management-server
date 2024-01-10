const { Task, Users } = require("../model/model");
//add new task
const addNewTask = async (taskData) => {
  try {
    const newTask = new Task(taskData);
    const saveTask = await newTask.save();
    return saveTask;
  } catch (error) {
    console.log("add task Error", error);
  }
};
//add new user
const addNewUser = async (userdata) => {
  try {
    console.log(userdata)
    userdata.mobile=(userdata.mobile).toString()
    const findUser =await Users.find({ email: userdata.email });
    console.log(findUser,'found')
    if (!findUser) {
      const saveUser = "Duplicate User";
      return saveUser;
    } else {
      const newUser = new Users(userdata);
      const saveUser = await newUser.save();
      return saveUser;
    }
  } catch (error) {
    console.log("add user Error", error);
  }
};
module.exports = { addNewTask, addNewUser };
