const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("../errors");
const User = require("../models/User");
const { attachCookiesToResponse,createUserToken, createUserToken2 } = require("../utils");
const register = async (req, res) => {
  //check if the email is already signed  , we already do that in schema , we don't have to implement this step
  const { name, email, password } = req.body;
  const emailUsed = await User.findOne({ email });
  if (emailUsed) {
    throw new CustomApiError.CustomAPIError(
      "this email already created account please use another email to signup "
    );
  }

  //make just the first user a admin
  const setRole = (await User.countDocuments()) === 0;
  const role = setRole ? "admin" : "user";

  //create the user
  const user = await User.create({ name, email, password, role });
  //the payload we will passed to create jsonwebtoken
  const tokenUser = createUserToken2(user);
console.log(tokenUser)
  //function from utils folder
  attachCookiesToResponse({ res, tokenUser });

  res.json({tokenUser});
};

const login = async (req, res) => {
  // receive the email and the password
  const { email, password } = req.body;
  //throw an error if the email or password are missing
  if (!email || !password) {
    throw new CustomApiError.BadRequestError(
      "please provide email and password "
    );
  }
  //find the user in the database and throw error if its not exist
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomApiError.UnauthenticatedError(
      "the email is not registerd "
    );
  }
  const passwordIsCorrect = await user.comparePassword(password);
  if (!passwordIsCorrect) {
    throw new CustomApiError.UnauthenticatedError("the password is invalid ");
  }
  //the payload we will passed to create jsonwebtoken
  const tokenUser =createUserToken2(user);

  //function from utils folder
  attachCookiesToResponse({ res, tokenUser });

  res.send(tokenUser);
};

const logout = async (req, res) => {
  res.cookie("token", "logged out", {
    //when expires it will automatically be deleted 
    expires: new Date(Date.now() + 5 * 1000),
  });
  res.status(StatusCodes.OK).send("you logged out ")
};

module.exports = { register, login, logout };
