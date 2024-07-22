const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const menuController = require("../controllers/menuControllers");
//get all routes
router.get("/", menuController.getAllMenuItems);
router.post("/", menuController.postMenuItem);
router.delete("/:id", menuController.deleteTour);
router.get("/:id", menuController.getMenuById);

module.exports = router;
