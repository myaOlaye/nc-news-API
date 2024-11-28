const express = require("express");
const articlesRouter = express.Router();

const {
  getArticle,
  getArticles,
  getComments,
} = require("../controllers/get-controllers");
const { postComment } = require("../controllers/post-controllers");
const { patchArticle } = require("../controllers/patch-controllers");

articlesRouter.get("/", getArticles);
articlesRouter.route("/:article_id").get(getArticle).patch(patchArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
