const express = require("express");
const {
  customErrorHandler,
  postgressErrorHandler,
  invalidUrlErrorHandler,
} = require("./controllers/error-controllers");
const {
  getApi,
  getTopics,
  getArticle,
  getArticles,
  getComments,
} = require("./controllers/get-controllers");
const { postComment } = require("./controllers/post-controllers");

const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.all("*", invalidUrlErrorHandler);

app.use(customErrorHandler);

app.use(postgressErrorHandler);

module.exports = app;
