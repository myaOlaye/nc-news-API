const express = require("express");
const usersRouter = express.Router();

const { getUsers, getUser } = require("../controllers/get-controllers");
const { postUser, loginUser } = require("../controllers/post-controllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUser);

usersRouter.post("/", postUser);

usersRouter.post("/login", loginUser);

module.exports = usersRouter;
