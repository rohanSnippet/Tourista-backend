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
  ratings: [
    {
      tour_id: {
        type: Schema.Types.ObjectId,
      },
      stars: {
        type: mongoose.Schema.Types.Decimal128,
        min: 0,
        max: 5,
      },
      feedback: {
        type: String,
        trim: true,
      },
    },
  ],
});

//model instance
const User = mongoose.model("User", userSchema);
module.exports = User;
