const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  fullName: String,
  email: String,
  password: String,
  mobNo: String,
  dob: String
});

module.exports = mongoose.model("User", userSchema);