const db = require("../db/connection");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env.secrets" });

exports.handleRefreshToken = (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) {
    return res.status(401).send("Refresh token missing");
  }

  return db
    .query(`SELECT * FROM users WHERE refresh_token = $1`, [refreshToken])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 403, msg: "Forbidden" });
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || rows[0].username !== decoded.username) {
            return res.status(403).send({ msg: "Forbidden" });
          }
          const accessToken = jwt.sign(
            { username: decoded.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "45s" }
          );
          res.send({ accessToken });
        }
      );
    });
};
