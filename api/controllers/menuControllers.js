const Menu = require("../models/Menu");

const getAllMenuItems = async (req, res) => {
  try {
    const menus = await Menu.find({}).sort({ createdAt: -1 });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postMenuItem = async (req, res) => {
  const newItem = req.body;

  try {
    const result = await Menu.create(newItem);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMenuById = async (req, res) => {
  const id = req.params.id;
  try {
    const menu = await Menu.findById(id);
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete Tour
const deleteTour = async (req, res) => {
  const tourId = req.params.id;
  console.log(tourId);
  try {
    const deletedItem = await Menu.findByIdAndDelete(tourId);
    console.log(deletedItem);
    if (!deletedItem) {
      return res.status(404).json({ message: "Tour not found" });
    }
    return res.status(200).json({ message: "Tour is deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  postMenuItem,
  deleteTour,
  getMenuById,
};
