const express = require("express");
const User = require("../models/User");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

router.get("/", verifyToken, verifyAdmin, userControllers.getAllUsers);
router.post("/", userControllers.createUser);
router.delete("/:id", verifyToken, verifyAdmin, userControllers.deleteUser);
router.patch("/admin/:id", verifyToken, userControllers.makeAdmin);
router.get("/admin/:email", verifyToken, verifyAdmin, userControllers.getAdmin);
module.exports = router;
