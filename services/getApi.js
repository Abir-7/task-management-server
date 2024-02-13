const {
  Users,
  Project,
  UserConections,
  MessageModel,
} = require("../model/model");
const mongoose = require("mongoose");
//check admin
const checkAdmin = async (email) => {
  try {
    let isAdmin;
    const person = await Users.findOne({ email: email });
    ////console.log(person,'person')
    if (person.role == "admin") {
      ////console.log('hit')
      isAdmin = true;
      return isAdmin;
    } else {
      ////console.log('hit2')
      isAdmin = false;
      return isAdmin;
    }
  } catch (error) {
    ////console.log("a Error", error);
  }
};

//get all user

const getAllUser = async () => {
  try {
    const withAdmin = await Users.find();
    const withOutAdmin = await Users.find({ role: "user" });
    return { withAdmin, withOutAdmin };
  } catch (error) {}
};

//get all task
const findAllTask = async (id) => {
  try {
    const getAllTask = await Project.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }, // Match the project by its _id
      },
      {
        $project: {
          _id: 1,
          allTask: 1,
          allPersons: { $setUnion: "$allTask.assign" },
          isCompleted: 1,
        },
      },
    ]);
    ////console.log(getAllTask)

    const withOutAdmin = await Users.find({ role: "user" });

    const pendingTask = getAllTask[0]?.allTask?.filter(
      (task) => task.status == "pending"
    );
    const onGoingTask = getAllTask[0]?.allTask?.filter(
      (task) => task.status == "inProgress"
    );
    const completedTask = getAllTask[0]?.allTask?.filter(
      (task) => task.status == "completed"
    );

    return {
      getAllTask: getAllTask[0].allTask,
      assignedPerson: getAllTask[0].allPersons,
      withOutAdmin,
      pendingTask,
      onGoingTask,
      completedTask,
      isCompleted: getAllTask[0].isCompleted,
    };
  } catch (error) {
    ////console.log("a Error", error);
  }
};

//get all project
const getAllProject = async () => {
  try {
    const pendingProject = await Project.find({ isCompleted: false });
    const completedProject = await Project.find({ isCompleted: true });
    return { pendingProject, completedProject };
  } catch (error) {
    ////console.log(error)
  }
};

//get connection

const getConnection = async (email) => {
  try {
    const allAcceptedConnection = await UserConections.find({
      persons: { $elemMatch: { email: email } },
      status: "accepted",
    });
    const allPendingConnection = await UserConections.find({
      persons: { $elemMatch: { email: email } },
      status: "pending",
      requestedBy: { $ne: email },
    });

    //console.log(allAcceptedConnection)
    //console.log(allPendingConnection)
    const acceptedConnectionEmail = allAcceptedConnection
      .flatMap((c) => c.persons.filter((p) => p.email !== email))
      .map((p) => p.email);

    return {
      allAcceptedConnection,
      allPendingConnection,
      acceptedConnectionEmail,
    };
  } catch (error) {
    throw error;
  }
};

//get all message by ID

const allMessageByID = async (cId) => {
  try {
    const findAllMessage = await MessageModel.find({ connect_Id: cId });

    //console.log(findAllMessage)
    return findAllMessage;
  } catch (error) {
    throw error;
  }
};

//get all user Chat

const getAllUserChat = async (email) => {
  try {
    console.log(email);
    const pendingConnections = await UserConections.find({
      $and: [{ requestedBy: email }, { status: "pending" }],
    });

    const collectEmail = pendingConnections.flatMap((c) =>
      c.persons.filter((p) => p.email !== email).map((p) => p.email)
    );

    const allPendingEmail = await Promise.all(collectEmail);

    const withAdmin = await Users.find({ email: { $nin: allPendingEmail } });

    const reqestedUser = await Users.find({ email: { $in: allPendingEmail } });

    //const withAdmin = await Users.find();
    //console.log(filteredUsers,'collectEmail')

    const withOutAdmin = await Users.find({ role: "user" });
    return { withAdmin, withOutAdmin, reqestedUser };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findAllTask,
  checkAdmin,
  getAllUser,
  getAllProject,
  getConnection,
  allMessageByID,
  getAllUserChat,
};
