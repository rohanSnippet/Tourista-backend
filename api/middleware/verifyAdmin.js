const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };

  const user = await User.findOne(query);
  const isAdmin = user?.role === "admin";

  if (isAdmin) {
    next();
  } else {
    return res.status(403).send({ message: "forbidden access" });
  }
};

module.exports = verifyAdmin;
