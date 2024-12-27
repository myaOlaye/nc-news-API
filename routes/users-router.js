const express = require("express");
const usersRouter = express.Router();

const { getUsers, getUser } = require("../controllers/get-controllers");
const { postUser, loginUser } = require("../controllers/post-controllers");

usersRouter.route("/").get(getUsers).post(postUser);

usersRouter.get("/:username", getUser);

usersRouter.post("/login", loginUser);

module.exports = usersRouter;
