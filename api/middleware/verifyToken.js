const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Unauthorized access to MongoDB" });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token has expired" });
      } else {
        return res.status(401).send({ message: "Token is invalid" });
      }
    }
    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;
