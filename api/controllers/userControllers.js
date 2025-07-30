const User = require("../models/User");
const Menu = require("../models/Menu");
const { Decimal128 } = require("mongodb");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

//post a new user
const createUser = async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  try {
    const existingUser = await User.findOne(query);
    if (existingUser) {
      return res.status(302).json({ message: "User already exists" });
    }
    const result = await User.create(user);
    res.status(201).json({ message: "User created successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete a user
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get admin
const getAdmin = async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  try {
    const user = await User.findOne(query);
    //console.log(user);
    if (email !== req.decoded.email) {
      res.status(404).json({ message: "Forbidden access" });
    }
    let admin = false;
    if (user) {
      admin = user?.role === "admin";
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//set user as admin
const makeAdmin = async (req, res) => {
  const userId = req.params.id;
  const { name, email, photoURL, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const giveRating = async (req, res) => {
  try {
    const { email } = req.params; // User email passed in the URL
    const { tour_id, stars, feedback } = req.body; // Rating details from the request body
    // console.log(email, "   ", tour_id);
    // Validate input
    if (!tour_id || stars == null || !feedback) {
      return res
        .status(400)
        .json({ message: "Tour ID, stars, and feedback are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    //console.log("user is :", user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const existingRating = user.ratings.find(
      (rating) => rating.tour_id.toString() === tour_id
    );

    if (existingRating) {
      // Update the existing rating
      existingRating.stars = stars;
      existingRating.feedback = feedback;
    } else {
      // Add a new rating
      user.ratings.push({ tour_id, stars, feedback });
    }

    // Add the rating to the user's ratings array

    // Save the updated user
    await user.save();

    // Find the menu item by tour_id (assuming tour_id corresponds to menu item)
    console.log(typeof tour_id);
    const menu = await Menu.findById(tour_id);
    console.log("menu is :", menu);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found." });
    }

    // Convert Decimal128 to Number for stars and calculate the new average stars
    const currentStars = menu.stars ? parseFloat(menu.stars.toString()) : 0; // Convert Decimal128 to Number
    const totalStars = currentStars * (menu.reveiws || 0) + stars;
    const totalReviews = !existingRating ? (menu.reveiws || 0) + 1 : "";
    const averageStars = totalStars / totalReviews;

    // Store the updated average stars as Decimal128
    menu.stars = new Decimal128(averageStars.toString()); // Ensure Decimal128 precision is maintained
    menu.reveiws = totalReviews;

    // Save the updated menu
    await menu.save();

    res.status(200).json({ message: "Rating added successfully.", user, menu });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getRatings = async (req, res) => {
  const { tour_id } = req.params;
  try {
    const users = await User.find();
    // console.log(users);
    const reviews = [];
    users.forEach((user) => {
      const userRatings = user.ratings.filter(
        (rating) => rating.tour_id == tour_id
      );
      reviews.push(...userRatings);
    });
    console.log(reviews);
    const sortedReviews = reviews.sort((a, b) => b.stars - a.stars);

    res.json(sortedReviews);
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userRating = async (req, res) => {
  const { email, tour_id } = req.params;

  try {
    // Fetch user by email
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if ratings exist
    if (!user.ratings || !Array.isArray(user.ratings)) {
      return res.status(404).json({ message: "No ratings found for the user" });
    }

    // Filter ratings for the specific tour_id
    const review = user.ratings.find(
      (rating) => rating.tour_id.toString() === tour_id
    );

    // If no matching rating is found
    if (!review) {
      return res
        .status(404)
        .json({ message: "Rating not found for the specified tour" });
    }

    // Return the filtered review
    res.json(review);
  } catch (error) {
    console.error("Error fetching user rating:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the rating" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  getAdmin,
  makeAdmin,
  giveRating,
  getRatings,
  userRating,
};
