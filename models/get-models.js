const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticle = (article_id) => {
  return db
    .query(
      `SELECT 
    articles.*,
    COUNT(comments.comment_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id `,

      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.selectArticles = (
  sort_by = "created_at",
  topic,
  order = "desc",
  limit = 10,
  p = 1
) => {
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

  if (
    !validSorts.includes(sort_by) ||
    !validOrder.includes(order) ||
    limit < 1 ||
    isNaN(limit) ||
    p < 1 ||
    isNaN(p)
  ) {
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
    const total_count = rows.length;

    const requestedPage = rows.splice((p - 1) * limit, limit);

    return [requestedPage, total_count];
  });
};

exports.selectComments = (article_id, limit = 10, p = 1) => {
  if (isNaN(limit) || limit < 1 || isNaN(p) || p < 1) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      const requestedPage = rows.splice((p - 1) * limit, limit);
      return requestedPage;
    });
};
exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    console.log(rows);
    return rows;
  });
};

exports.selectUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};
