const { totalCount } = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");
const endpointsJson = require("../endpoints.json");
const {
  selectTopics,
  selectArticle,
  selectArticles,
  selectComments,
  selectUsers,
  selectUser,
} = require("../models/get-models");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, topic, order, limit, p } = req.query;
  selectArticles(sort_by, topic, order, limit, p)
    .then((articlesData) => {
      res
        .status(200)
        .send({ articles: articlesData[0], total_count: articlesData[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  const promises = [selectComments(article_id, limit, p)];

  if (article_id) {
    promises.push(selectArticle(article_id));
  }

  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  selectUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
