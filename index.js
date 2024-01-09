const express = require("express");
require('dotenv').config()
var cors = require("cors");
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const mongoose = require("mongoose");
const { addNewTask } = require("./services/postApi");
const { findAllTask } = require("./services/getApi");

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected!"));

//add a task
app.use("/addTask", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const saveTask = await addNewTask(data);
    res.status(201).send({
      message: "Task added successfully",
      addedTask: saveTask,
    });
    console.log(saveTask);
  } catch (error) {
    console.log(error);
  }
});

//get all task
app.use("/getAllTask", async (req, res) => {
  try {
    const allTask = await findAllTask();
    res.status(201).send(allTask);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`task-managemnet app listening on port ${port}`);
});
