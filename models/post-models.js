const db = require("../db/connection");
const bcrypt = require("bcrypt");

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

exports.insertNewTopic = (newTopic) => {
  const { slug, description } = newTopic;
  return db
    .query(
      `INSERT INTO topics(slug, description)
  VALUES ($1,$2) RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.insertNewUser = (newUser) => {
  const { username, name, avatar_url, password } = newUser;

  return bcrypt
    .genSalt(10)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return db.query(
        `INSERT INTO users(username, name, avatar_url, password)
  VALUES ($1,$2, $3, $4) RETURNING *`,
        [username, name, avatar_url, hashedPassword]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.validateUser = (username, password) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return bcrypt.compare(password, rows[0].password).then((result) => {
        if (result) {
          return { status: 200, msg: "Succesfully logged in" };
        } else {
          return Promise.reject({ status: 401, msg: "Incorrect password" });
        }
      });
    });
};
