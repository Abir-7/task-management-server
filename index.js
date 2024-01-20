const express = require("express");



const cors = require('cors')
const app = express();

app.use(cors({origin:'*'}));
app.use(express.json())

require("dotenv").config();



const port = process.env.PORT || 3000;
var jwt = require("jsonwebtoken");


const {
  addNewTask,
  addNewUser,
  addNewProject,
  updateTask,
  deleteTask,
  updateProject,
} = require("./services/postApi");
const {
  findAllTask,
  checkAdmin,
  getAllUser,
  getAllProject,
} = require("./services/getApi");

//mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI).then(() => console.log("Connected!"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }
  // bearer token
  const token = authorization.split(" ")[1];

  ////console.log(token);
  jwt.verify(token, process.env.ACCESS_Token, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ error: true, message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

//jwt token
app.post("/jwt", (req, res) => {
//console.log("hit");
  const user = req.body;
  //console.log(user,'user')
  const token = jwt.sign(user, process.env.ACCESS_Token, { expiresIn: "10h" });
  res.send({ token });
});

// verify admin
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const isAdmin = await checkAdmin(email);

  if (isAdmin == false) {
    //////////console.log('false section')
    return res
      .status(403)
      .send({ error: true, message: "forbidden Access", isAdmin: false });
  } else {
    next();
  }
};

app.get("/checkAdmin", verifyJWT, async (req, res) => {
  try {
    const email = req.decoded.email;
    const email2 = req.query.email;
    //console.log("sdsa", email2);

    const checkIsAdmin = await checkAdmin(email2);
    //console.log(checkIsAdmin);
    res.status(201).send({ isAdmin: checkIsAdmin });
  } catch (error) {
    console.log(error, "checkAdmin");
    throw error;
  }
});

//add new user
app.post("/addNewUser", async (req, res) => {
  try {
    const data = req.body;
    const saveNewUser = await addNewUser(data);
    //console.log(saveNewUser, "main");
    res.status(201).send({
      message:
        saveNewUser == "Duplicate User"
          ? "Duplicate User"
          : "User added successfully",
      newUser: saveNewUser,
    });
  } catch (error) {
    console.log(error, "addNewUser");
    throw error;
  }
});

//get all user
app.get("/getAllUser", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const allUser = await getAllUser();
    ////console.log(allUser);
    res.status(201).send(allUser);
  } catch (error) {
    console.log(error, "getAllUser");
    throw error;
  }
});
//add new project
app.post("/addProject", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const data = req.body;
    const newProject = await addNewProject(data);
    res.status(201).send({
      message: "Project added successfully",
      newProject,
    });
  } catch (error) {
    console.log(error, "addProject");
    throw error;
  }
});

//update a project project
app.put("/updateProject", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const data = req.body;
    const updatedProject = await updateProject(data);
    res.status(201).send({
      message: "Project updated successfully",
      updatedProject,
    });
  } catch (error) {
    console.log(error, "updateProject");
    throw error;
  }
});
//get all project
app.get("/getAllProject", verifyJWT, async (req, res) => {
  try {
   // console.log("hit project");
    const allProject = await getAllProject();
    res.status(201).send(allProject);
  } catch (error) {
    console.log(error, "getAllProject");
    throw error;
  }
});

//add a task to a project
app.post("/addTask", async (req, res) => {
  try {
    const data = req.body;
    const saveTask = await addNewTask(data);

    res.status(201).send({
      message: "Task added successfully",
      addedTask: saveTask,
    });
  } catch (error) {
    console.log(error, "addTask");
    throw error;
  }
});

//get all task
app.get("/getAllTask/:id", verifyJWT, async (req, res) => {
  try {
    const id = req.params.id;

    const allTask = await findAllTask(id);
    // //console.log(allTask)
    res.status(201).send(allTask);
  } catch (error) {
    console.log(error, "getAllTask");
    throw error;
  }
});
//update a task
app.put("/updateTask", async (req, res) => {
  try {
    const data = req.body;
    const updatedTask = await updateTask(data);

    res.status(201).send({
      message: "Task updated successfully",
      updatedTask: updatedTask,
    });
  } catch (error) {
    console.log(error, "updateTask");
    throw error;
  }
});
// delete a task
app.delete("/deleteTask", async (req, res) => {
  try {
    const data = req.body;
    const deletedTask = await deleteTask(data);
    res.status(201).send({
      message: "Task deleted successfully",
      deletedTask: deletedTask,
    });
  } catch (error) {
    console.log(error, "deleteTask");
    throw error;
  }
});




//app listening
app.listen(port, () => {
  console.log(`task-managemnet app listening on port ${port}`)
});
