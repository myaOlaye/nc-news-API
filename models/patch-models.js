const db = require("../db/connection");

exports.updateArticle = (inc_votes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2
        RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.updateComment = (inc_votes, comment_id) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2
        RETURNING *`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};
