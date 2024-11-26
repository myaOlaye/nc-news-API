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
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query("SELECT * FROM comments")
    .then(({ rows }) => {
      const commentData = {};
      // How can I do this with on query to the database using JOIN? Do I need an agregeate function?
      for (let i = 0; i < rows.length; i++) {
        const currentArticle_id = rows[i].article_id;
        commentData[currentArticle_id] =
          commentData[currentArticle_id] + 1 || 1;
      }
      return commentData;
    })
    .then((commentData) => {
      return db
        .query("SELECT * FROM articles ORDER BY created_at desc")
        .then(({ rows }) => {
          rows.forEach((article) => {
            article.comment_count = commentData[article.article_id] || 0;
            delete article.body;
          });
          return rows;
        });
    });
};

exports.selectComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      // if (rows.length === 0) {
      //   return Promise.reject({ status: 404, msg: "Not found" });
      // }
      return rows;
    });
};
