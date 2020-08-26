const { Schema, model } = require("mongoose");

const studentSchema = new Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  typeBootCamp: String,
});

module.exports = model("Student", studentSchema);
