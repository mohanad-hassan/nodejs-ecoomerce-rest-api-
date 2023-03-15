const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,//to check that the user cant signup with the same email more than once , we can check this in controller by Schema.find()
    required: [true, 'Please provide email'],
    validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
    },
    },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});
//this is mongodb hook just executes this function before save the document to the db .
UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths()); // it returns the values that you modified 
  // console.log(this.isModified('name')); returns Boolean if this value has been modified 
  if (!this.isModified('password')) return; // to prevent rehash the password if the user didn't modified the  password 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);  // this refers to the current document you working with .
});
//a function we created to use it later , it compare the password the user interd  and the hashed password in the data base .
//you cant un hash password  , just you can compare  . 
//this function will be executed on the instance of the schema when calling it (in this case its user ) 
UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
