const {Task, Users}=require('../model/model')

//check admin
const checkAdmin= async(email)=>{
  try {
    let isAdmin
    const person= await Users.findOne({email:email})
    console.log(person,'person')
    if(person.role=='admin'){
      console.log('hit')
      isAdmin=true
      return isAdmin
    }
    else{
      console.log('hit2')
      isAdmin=false
      return isAdmin
    }
  } catch (error) {
    console.log("a Error", error);
  }
}


//get all task
const findAllTask = async () => {
  try {
    const getAllTask = await Task.find();
    return getAllTask;
  } catch (error) {
    console.log("a Error", error);
  }
};



module.exports={findAllTask,checkAdmin}