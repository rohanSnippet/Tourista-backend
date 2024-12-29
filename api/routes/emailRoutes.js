const express = require("express");
const router = express.Router();
const emailControllers = require("../controllers/emailControllers");
//get all routes
router.post("/", emailControllers.createQuery);

router.get("/", emailControllers.getAllQueries);

module.exports = router;
