const { insertNewComment } = require("../models/post-models");

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;

  insertNewComment(newComment, article_id)
    .then((newComment) => {
      res.status(201).send(newComment);
    })
    .catch((err) => {
      next(err);
    });
};
