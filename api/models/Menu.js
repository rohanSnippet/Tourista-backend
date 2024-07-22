const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the menu schema model
const menuSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  recipe: String,
  image: String,
  category: [String],
  /*  {
      type: String,
      enum: ["hill", "beach", "forest", "popular"],
    }, */

  price: Number,
  Days: [
    {
      _id: false,
      day_number: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      places: {
        type: [String],
        required: true,
      },
      meals: {
        type: [String],
        required: true,
      },
    },
  ],
  Departure_City: {
    type: String,
    required: true,
  },
  tour_includes: [String],
  Arrival_City: {
    type: String,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  reveiws: Number,
  stars: Decimal128,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//create model
const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
