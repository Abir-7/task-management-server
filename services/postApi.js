const { set } = require("mongoose");
const { Users, Project, UserConections, MessageModel } = require("../model/model");
const mongoose = require("mongoose");

//add new Project
const addNewProject = async (projectData) => {
  try {
    const newProject = new Project(projectData);
    const saveProject = await newProject.save();
    return saveProject;
  } catch (error) {
    ////console.log("add project Error", error);
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
    ////console.log("add project Error", error);
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
    ////console.log("add task Error", error);
  }
};
//update a task
const updateTask = async (data) => {
  try {
    const id = data.id;
    const taskName = data.taskName;
    const status = data.status;
    const description = data.description;
    ////console.log(description,'aaaaaaaaaaa',status)
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
    ////console.log(error)
  }
};
//
const deleteTask = async (data) => {
  console.log(data,'id')

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

  return deleleTask
};
//add new user
const addNewUser = async (userdata) => {
  try {
    //console.log(userdata);
    userdata.mobile = userdata.mobile.toString();
    const findUser = await Users.find({ email: userdata.email });
    ////console.log(findUser, "found");
    if (!findUser) {
      const saveUser = "Duplicate User";
      return saveUser;
    } else {
      const newUser = new Users(userdata);
      const saveUser = await newUser.save();
      return saveUser;
    }
  } catch (error) {
    ////console.log("add user Error", error);
  }
};

//create connection 

const createConnections=async(data)=>{
try {

  if (data.email1 == data.email2) {
    return { msg: "email must be defferent" ,data:{}};
  }

  const findConnection= await UserConections.findOne({
    $and: [
      { persons: { $elemMatch: { email: data.email1 } } },
      { persons: { $elemMatch: { email: data.email2 } } }
    ]
  })

  if(findConnection){
   // console.log(findConnection)
    return {msg:'allready has connection',data:findConnection}
  }

  const user1= await Users.findOne({email:data.email1}).select({name:1,photoURL:1})
  const user2= await Users.findOne({email:data.email2}).select({name:1,photoURL:1})
  console.log(data,'connection',user2)

  const createConnection= new UserConections({requestedBy:data.email1,status:'pending',persons:[{email:data.email1,name:user1.name,photoURL:user1.photoURL},{email:data.email2,name:user2.name,photoURL:user2.photoURL}]})
  const savedConnection =await createConnection.save()
  return {msg:'connection create successfull',data:savedConnection}
} catch (error) {
  throw error
}
}

const statusUpdate=async(data)=>{
try {
  const updateStatus= await UserConections.updateOne({_id: new mongoose.Types.ObjectId(data.id)},{
    $set:{
      status:data.status
    }
  })
  const requestedBy= await  UserConections.findOne({_id: new mongoose.Types.ObjectId(data.id)})
  console.log(updateStatus,'update status')

  return {updateStatus,requestedBy:requestedBy.requestedBy}

} catch (error) {
  throw error
}
}

const messagePost=async(data)=>{
try {
  const {connect_Id,msgData}=data
  const message= new MessageModel({connect_Id,msgData})

  const saveMessage= await message.save()
  return saveMessage
} catch (error) {
  throw error
}
}



module.exports = {
  addNewTask,
  addNewUser,
  addNewProject,
  updateTask,
  deleteTask,
  updateProject,
  createConnections,
  statusUpdate,
  messagePost
};
