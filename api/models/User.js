const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    minlength: 3,
    trim: true,
  },
  photoURL: String,
  role: {
    type: String,
    trim: ["user", "admin"],
    default: "user",
  },
});

//model instance
const User = mongoose.model("User", userSchema);
module.exports = User;
