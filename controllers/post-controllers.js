const {
  insertNewComment,
  insertNewArticle,
  insertNewTopic,
  insertNewUser,
  authUser,
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

exports.postUser = (req, res, next) => {
  const newUser = req.body;

  insertNewUser(newUser)
    .then((newUser) => {
      res.status(201).send({ newUser });
    })
    .catch((err) => {
      next(err);
    });
};

exports.loginUser = (req, res, next) => {
  const { username, password } = req.body;

  authUser(username, password)
    .then(({ status, accessToken, refreshToken }) => {
      res
        .status(status)
        .cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .send({ accessToken });
    })
    .catch((err) => {
      next(err);
    });
};
