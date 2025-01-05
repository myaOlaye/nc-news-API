require("dotenv").config({ path: ".env.secrets" });
const jwt = require("jsonwebtoken");

exports.verifyJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Unauthorised, header missing");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ msg: "Invalid or expired token" });
    } else {
      req.username = decoded.username;
      next();
    }
  });
};
