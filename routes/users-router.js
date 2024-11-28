const express = require("express");
const usersRouter = express.Router();

const { getUsers } = require("../controllers/get-controllers");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
