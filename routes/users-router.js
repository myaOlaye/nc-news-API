const express = require("express");
const usersRouter = express.Router();
const { verifyJwt } = require("../controllers/verifyJwt");
const { getUsers, getUser } = require("../controllers/get-controllers");
const { postUser, loginUser } = require("../controllers/post-controllers");
const { handleRefreshToken } = require("../controllers/refreshTokenController");
const { handleLogout } = require("../controllers/logout-controller");

usersRouter.route("/").get(getUsers).post(postUser);

usersRouter.post("/login", loginUser);
usersRouter.get("/refresh", handleRefreshToken);
usersRouter.post("/logout", handleLogout);

// account page endpoint
usersRouter.get("/:username", verifyJwt, getUser);

module.exports = usersRouter;
