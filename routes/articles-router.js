const express = require("express");
const articlesRouter = express.Router();

const {
  getArticle,
  getArticles,
  getComments,
} = require("../controllers/get-controllers");
const { postComment, postArticle } = require("../controllers/post-controllers");
const { patchArticle } = require("../controllers/patch-controllers");
const { deleteArticle } = require("../controllers/delete-controllers");

articlesRouter.route("/").get(getArticles).post(postArticle);
articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
