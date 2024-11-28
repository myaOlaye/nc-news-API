const db = require("../db/connection");

exports.insertNewComment = (newComment, article_id) => {
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments(body, article_id, author)
    VALUES ($1,$2,$3) RETURNING *`,
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.insertNewArticle = (newArticle) => {
  const { author, title, body, topic } = newArticle;
  return db
    .query(
      `INSERT INTO articles(author, title, body, topic)
    VALUES ($1,$2,$3, $4) RETURNING *`,
      [author, title, body, topic]
    )
    .then(({ rows }) => {
      rows[0].comment_count = 0;
      return rows[0];
    });
};
