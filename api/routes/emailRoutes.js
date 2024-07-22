const express = require("express");
const router = express.Router();
const UserQuery = require("../models/UserQuery");
const emailControllers = require("../controllers/emailControllers");
//get all routes
router.get("/", emailControllers.getAllQueries);
router.post("/", emailControllers.createQuery);

module.exports = router;
