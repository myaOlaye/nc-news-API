const {
  removeComment,
  checkCommentExists,
  removeArticle,
} = require("../models/delete-models");
const { selectArticle } = require("../models/get-models");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  const promises = [checkCommentExists(comment_id), removeComment(comment_id)];

  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [selectArticle(article_id), removeArticle(article_id)];

  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
