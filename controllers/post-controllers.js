const {
  insertNewComment,
  insertNewArticle,
  insertNewTopic,
} = require("../models/post-models");

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

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;

  insertNewArticle(newArticle)
    .then((newArticle) => {
      res.status(201).send({ newArticle });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body;

  insertNewTopic(newTopic)
    .then((newTopic) => {
      res.status(201).send({ newTopic });
    })
    .catch(next);
};
