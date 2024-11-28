const { updateArticle, updateComment } = require("../models/patch-models");

exports.patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticle(inc_votes, article_id)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;

  updateComment(inc_votes, comment_id)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};
