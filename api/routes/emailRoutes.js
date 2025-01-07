const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const emailControllers = require("../controllers/emailControllers");
//get all routes
router.post("/", verifyToken, emailControllers.createQuery);

router.get("/", verifyToken, verifyAdmin, emailControllers.getAllQueries);

module.exports = router;
