const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticle = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query("SELECT * FROM comments")
    .then(({ rows }) => {
      const commentData = {};

      for (let i = 0; i < rows.length; i++) {
        const currentArticle_id = rows[i].article_id;
        commentData[currentArticle_id] =
          commentData[currentArticle_id] + 1 || 1;
      }
      return commentData;
    })
    .then((commentData) => {
      return db.query("SELECT * FROM articles").then(({ rows }) => {
        rows.forEach((article) => {
          article.comment_count = commentData[article.article_id] || 0;
          delete article.body;
        });
        rows.sort((a, b) => b.created_at - a.created_at);
        return rows;
      });
    });
};
