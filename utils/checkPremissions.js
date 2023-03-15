//this function is to prevent users except admin from see other user profiles by id 


const  CustomAPIError = require("../errors")

const checkPermissions  = (currentUser,user) => { 
  const userId = user._id
  const currentUserId  =  currentUser.userId
  //  console.log(typeof currentUserId,currentUserId)
   //console.log(typeof userId,userId) //the type of it is object we have to make it string by toString()
   console.log(user)
  if (currentUserId===userId.toString() ||currentUser.role==='admin') {return}
  else {
    throw new CustomAPIError.Unauthorized("only admin or profile owner can see this page ")
  }

 }

module.exports = {checkPermissions}