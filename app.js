const express = require("express");
const {
  badUrlErrorHandler,
  customErrorHandler,
  postgressErrorHandler,
} = require("./controllers/error-controllers");
const {
  getApi,
  getTopics,
  getArticle,
} = require("./controllers/get-controllers");

const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.all("*", badUrlErrorHandler);

app.use(customErrorHandler);

app.use(postgressErrorHandler);

module.exports = app;
