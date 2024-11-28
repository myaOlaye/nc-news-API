const express = require("express");
const apiRouter = express.Router();
const articlesRouter = require("./articles-router.js");
const topicsRouter = require("./topics-router.js");
const usersRouter = require("./users-router.js");
const commentsRouter = require("./comments-router.js");

const { getApi } = require("../controllers/get-controllers");

apiRouter.get("/", getApi);

//Subrouters
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
