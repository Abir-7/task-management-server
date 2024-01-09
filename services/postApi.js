const { Task } = require("../model/model");

const addNewTask = async (taskData) => {
  try {
    const newTask = new Task(taskData);
    const saveTask = await newTask.save();
    return saveTask;
  } catch (error) {
    console.log("a Error", error);
  }
};

module.exports={addNewTask}