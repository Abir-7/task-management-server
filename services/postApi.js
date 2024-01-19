const { set } = require("mongoose");
const { Users, Project } = require("../model/model");
const mongoose = require("mongoose");

//add new Project
const addNewProject = async (projectData) => {
  try {
    const newProject = new Project(projectData);
    const saveProject = await newProject.save();
    return saveProject;
  } catch (error) {
    //console.log("add project Error", error);
  }
};

//update a Project

const updateProject = async (projectData) => {
  try {
    const id = projectData.id;
    const isCompleted = projectData.isCompleted;
    const updateProject = await Project.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          'isCompleted':isCompleted
        },
      }
    );
    return updateProject;
  } catch (error) {
    //console.log("add project Error", error);
  }
};

//add new task
const addNewTask = async (taskData) => {
  try {
    const userEmail = taskData.taskData.assign;
    const person = await Users.findOne({ email: userEmail }).select({
      email: 1,
      name: 1,
      photoURL:1
    });

    const project = await Project.updateOne(
      { _id: taskData.id },
      {
        $push: {
          allTask: {
            taskName: taskData.taskData.taskName,
            description: taskData.taskData.description,
            assign: person,
            date: taskData.taskData.date,
            status: taskData.taskData.status,
          },
        },
      }
    );
    return project;
  } catch (error) {
    //console.log("add task Error", error);
  }
};
//update a task
const updateTask = async (data) => {
  try {
    const id = data.id;
    const taskName = data.taskName;
    const status = data.status;
    const description = data.description;
    //console.log(description,'aaaaaaaaaaa',status)
    const updateTask = await Project.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
        allTask: {
          $elemMatch: {
            taskName: taskName,
            description: description,
          },
        },
      },
      {
        $set: {
          "allTask.$.status": status,
        },
      }
    );

    return updateTask;
  } catch (error) {
    //console.log(error)
  }
};
//
const deleteTask = async (data) => {
  const id = data.id;
  const taskName = data.taskName;
  const description = data.description;
  const deleleTask = await Project.updateOne(
    {
      _id: new mongoose.Types.ObjectId(id),
    },
    {
      $pull: {
        allTask: {
          taskName: taskName,
          description: description,
        },
      },
    }
  );
};
//add new user
const addNewUser = async (userdata) => {
  try {
    console.log(userdata);
    userdata.mobile = userdata.mobile.toString();
    const findUser = await Users.find({ email: userdata.email });
    //console.log(findUser, "found");
    if (!findUser) {
      const saveUser = "Duplicate User";
      return saveUser;
    } else {
      const newUser = new Users(userdata);
      const saveUser = await newUser.save();
      return saveUser;
    }
  } catch (error) {
    //console.log("add user Error", error);
  }
};
module.exports = {
  addNewTask,
  addNewUser,
  addNewProject,
  updateTask,
  deleteTask,
  updateProject,
};
