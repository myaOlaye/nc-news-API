const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticle = (article_id) => {
  console.log(article_id, typeof article_id);
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.selectArticles = (sort_by = "created_at", topic, order = "desc") => {
  const validSorts = [
    "article_id",
    "title",
    "author",
    "created_at",
    "votes",
    "topic",
    "article_img_url",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];
  const topicQuery = [];

  if (!validSorts.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryString = `SELECT 
  articles.article_id,
  articles.title,
  articles.author,
  articles.created_at,
  articles.votes,
  articles.topic,
  articles.article_img_url,
  COUNT(comments.comment_id)::int AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id `;

  if (topic) {
    queryString += `WHERE articles.topic = $1 `;
    topicQuery.push(topic);
  }

  queryString += `GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order};`;

  return db.query(queryString, topicQuery).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows;
  });
};

exports.selectComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
