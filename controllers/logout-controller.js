const db = require("../db/connection");

exports.handleLogout = (req, res, next) => {
  const refreshToken = req.cookies.jwt;
  console.log(refreshToken, "<-- refresh token");

  if (!refreshToken) {
    return res.status(204).send({ msg: "No refresh token to delete" });
  }

  return db
    .query("SELECT * FROM users WHERE refresh_token = $1", [refreshToken])
    .then(({ rows }) => {
      if (!rows[0]) {
        res.clearCookie("jwt", {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });
        return res
          .status(204)
          .send({ msg: "Refresh token not in db, deleted" });
      }

      return db
        .query(
          "UPDATE users SET refresh_token = NULL WHERE refresh_token = $1",
          [refreshToken]
        )
        .then(() => {
          res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
          });
          return res
            .status(204)
            .send({ msg: "Refresh token deleted and user logged out." });
        })
        .catch(next);
    })
    .catch(next);
};
