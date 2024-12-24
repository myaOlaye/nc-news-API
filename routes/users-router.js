const express = require("express");
const usersRouter = express.Router();

const { getUsers, getUser } = require("../controllers/get-controllers");
const { postUser, loginUser } = require("../controllers/post-controllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUser);

usersRouter.post("/login", loginUser);

usersRouter.post("/", postUser);

module.exports = usersRouter;
