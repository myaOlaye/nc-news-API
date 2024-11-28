const express = require("express");
const usersRouter = express.Router();

const { getUsers, getUser } = require("../controllers/get-controllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUser);

module.exports = usersRouter;
