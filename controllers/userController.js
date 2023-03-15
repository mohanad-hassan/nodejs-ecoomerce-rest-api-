const User = require("../models/User");
const CustomApiError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {createJwt,isTokenValid,attachCookiesToResponse,createUserToken,checkPermissions} = require("../utils")

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-passowrd");
  res.status(StatusCodes.OK).send(users);
};

//get single user 
const getSingleUser = async (req, res) => {
  const currentUser = req.user
 //take the id from params 
  const userId = req.params.id;

  //delete  the password from the returned object  , not from the database
  const user = await User.findOne({ _id: userId }).select("-passowrd");
  if (!user) {
    throw new CustomApiError.NotFoundError("user not found ");
  }
  //this function is to prevent users except admin from see other user profiles by id 
 checkPermissions(currentUser,user)
  
  res.status(StatusCodes.OK).send(user);
};
const showCurrentUser = (req, res) => {
  const user = req?.user;
  res.status(StatusCodes.OK).send({user, name: user.email, role: user.role });
};

//update user information's 

const updateUser =async (req,res) => { 
  //get the new name and email 
  const {newname,newemail}  = req.body 
  if (!newname || !newemail) {
    throw new CustomApiError.BadRequestError("please inter name and email ")
  }
  const {userId}   = req.user
  //get the document from the database 
  const user  = await User.findOne({userId})
  user.email  = newemail
  user.name  = newname
  //save the editing to the data base 
   await user.save()
  res.send(user)
 }

//update the user password
const updateUserPassword = async(req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomApiError.BadRequestError(
      "please inter old password and new password"
    );
  }
  //this user object comes from authentication middleware
  const {userId :id} = req.user;
  //find the user object in db by the id 
  const user  = await User.findById(id)
  //check if the password is correct
  const isPasswordCorrect  =await  user.comparePassword(oldPassword)
  if(!isPasswordCorrect) {
    throw new CustomApiError.BadRequestError("the password is false ")
  }

// push the new password to the user object
user.password = newPassword
//push the new password to the db 
//save() is important for hashing password that we set it in User Module 
const newUser  = await user.save()
//send the response 
  res.send(newUser)
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};





// REFERNCE 
/*// update the user information's 
//this will notwork because it wont trigger save() Hooks and it will dont hash the password 
const updateUser =async (req, res) => {
  //check for the name and email 
  const {name , email }  = req.body
  //throw an error if the name or email is missing 
  if (!name || !email )  {
    throw new CustomApiError.BadRequestError("please provide the name and email")
  }
  //get the old user infprmations from the token 
  const {userId}  = req.user
  //update the user information's with mongodb 
  const newUser  = await User.findByIdAndUpdate(userId,{name,email},{runValidators:true,new:true})
  const tokenUser  = createUserToken(newUser)
  attachCookiesToResponse({res,tokenUser})
  console.log(req.user)
  res.send(tokenUser)
  
  };*/
  