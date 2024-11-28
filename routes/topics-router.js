const express = require("express");
const topicsRouter = express.Router();

const { getTopics } = require("../controllers/get-controllers");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
