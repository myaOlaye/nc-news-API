const db = require("../db/connection");
exports.removeComment = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.removeArticle = (article_id) => {
  return db
    .query(`DELETE FROM comments WHERE article_id = $1`, [article_id])
    .then(() => {
      db.query(`DELETE FROM articles WHERE article_id = $1`, [article_id]);
    });
};
