const mongoose = require("mongoose");
const { Schema } = mongoose;

const userQuerySchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    minlength: 3,
    trim: true,
  },
  question: String,
  feedback: String,
  answer: {
    type: String,
    default: "Not Answered",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//model instance
const UserQuery = mongoose.model("UserQuery", userQuerySchema);
module.exports = UserQuery;
