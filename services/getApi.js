const {Task}=require('../model/model')

const findAllTask = async () => {
  try {
    const getAllTask = await Task.find();
    return getAllTask;
  } catch (error) {
    console.log("a Error", error);
  }
};

module.exports={findAllTask}