const express = require("express");
require("dotenv").config();
var cors = require("cors");
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
var jwt = require("jsonwebtoken");

const { addNewTask, addNewUser } = require("./services/postApi");
const { findAllTask, checkAdmin } = require("./services/getApi");

//mongoose
const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected!"));

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

  //console.log(token);
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
  const token = jwt.sign(user, process.env.ACCESS_Token, { expiresIn: "10h" });
  res.send({ token });
});

// verify admin
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const isAdmin = await checkAdmin(email);

  if (isAdmin == false) {
    ////////console.log('false section')
    return res
      .status(403)
      .send({ error: true, message: "forbidden Access", isAdmin: false });
  } else {
    next();
  }
};

app.use("/checkAdmin",async(req,res)=>{
 
  //onst email = req.decoded.email;

  const email2=req.query.email
  console.log('sdsa',email2)
  const checkIsAdmin= await checkAdmin(email2)

  console.log(checkIsAdmin)
  res.status(201).send({isAdmin:checkIsAdmin})

  
})

//add new user
app.use("/addNewUser", async (req, res) => {
  const data = req.body;
  const saveNewUser = await addNewUser(data);
  console.log(saveNewUser, "main");
  res.status(201).send({
    message:
      saveNewUser == "Duplicate User"
        ? "Duplicate User"
        : "User added successfully",
    newUser: saveNewUser,
  });
});

//get all user
app.use("/getAllUser", async (req, res) => {

});

//add a task
app.use("/addTask", async (req, res) => {
  try {
    const data = req.body;
    const saveTask = await addNewTask(data);
    res.status(201).send({
      message: "Task added successfully",
      addedTask: saveTask,
    });
  } catch (error) {}
})

//get all task
app.use("/getAllTask", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const allTask = await findAllTask();
    res.status(201).send(allTask);
  } catch (error) {
    //console.log(error);
  }
});

//app listening
app.listen(port, () => {
  console.log(`task-managemnet app listening on port ${port}`);
});
