const express = require("express");
const Carts = require("../models/Carts");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const cartController = require("../controllers/cartControllers");
//get all routes
router.get("/", cartController.getCartsByEmail);
//router.get("/", cartController.getCartItemById);
router.post("/", cartController.addToCart);
router.delete("/:id", cartController.deleteCartItem);
module.exports = router;
