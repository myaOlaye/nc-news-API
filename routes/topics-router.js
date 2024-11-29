const express = require("express");
const topicsRouter = express.Router();

const { getTopics } = require("../controllers/get-controllers");
const { postTopic } = require("../controllers/post-controllers");

topicsRouter.route("/").get(getTopics).post(postTopic);

module.exports = topicsRouter;
