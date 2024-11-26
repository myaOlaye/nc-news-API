const endpointsJson = require("../../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../../app");
const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const data = require("../../db/data/test-data");
require("jest-sorted");
/* Set up your beforeEach & afterAll functions here */

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET generic not found url request", () => {
  test("404: Responds with Not found when url does not exist", () => {
    return request(app)
      .get("/api/bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each with a slug and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toEqual(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/article/:article_id", () => {
  test("200: Responds with an article object of a specific id with all the required properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          article_id: 1,
        });
      });
  });
  test("404: Responds with Article not found when article of given id does not exist", () => {
    return request(app)
      .get("/api/articles/500")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("400: Responds with Bad request when given id is incorrect data type", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects, each containing a comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toEqual({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: Responds with an array of article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({
          key: "created_at",
          descending: true,
          coerce: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("200: Responds with an array of comments in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSorted({
          key: "created_at",
          descending: true,
          coerce: true,
        });
      });
  });

  test("404: Responds with Not found for an article id that doesn't exist", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("400: Responds with Bad request found for an article id that is invalid", () => {
    return request(app)
      .get("/api/articles/bananas/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("200: Responds with empty array for an id that exists but has no comments yet", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a given comment that has been posted to an article of a specific id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Posting a comment test!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const expectedOutput = {
          body: "Posting a comment test!",
          votes: 0,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        };
        expect(body).toMatchObject(expectedOutput);
      });
  });
  test("404: responds with not found when id doesn't exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Posting a comment test!",
    };
    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("400: responds with Bad request when id is invalid", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Posting a comment test!",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: responds with Not found when user does not exist", () => {
    const newComment = {
      username: "I dont exist",
      body: "I shouldn't be able to post anything!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  // For whoever sees this! (sorry for leaving a comment like this, potentially a bit cheeky)
  // BUT - I feel like 400 makes most sense for the test commented below as the body is the wrong data type
  // but the postgressql error code is the same as the above test and the "responds with not found when id doesn't exist" test '23503' when the inserted value violates the foreign key constraint (i.e, 404 not found because the user or id dosn't exist)
  // So how would I get the correct error message to show when I think they should have diff error messages but they have the same postgress error code?
  // Or am I interpreting what the error code should be incorrectly.
  // Or is the test below and above actually not neccesary, as how can a user post if they dont have an account! Sorry 🙈

  // test.only("400: responds with Bad request when body is not correct data type", () => {
  //   const newComment = {
  //     username: "I dont exist",
  //     body: 5,
  //   };
  //   return request(app)
  //     .post("/api/articles/1/comments")
  //     .send(newComment)
  //     .expect(400)
  //     .then(({ body: { msg } }) => {
  //       expect(msg).toBe("Bad request");
  //     });
  // });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with article of a specific id with updated votes property when votes have increased", () => {
    const voteUpdate = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          votes: 105,
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 1,
          article_img_url: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
        });
      });
  });
  test("200: responds with article of a specific id with updated votes property when votes have decreased", () => {
    const voteUpdate = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          votes: 95,
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 1,
          article_img_url: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
        });
      });
  });
  test("404: responds with Not found when article doesn't exist", () => {
    const voteUpdate = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/100")
      .send(voteUpdate)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("400: responds with Bad request when article is invalid", () => {
    const voteUpdate = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/banana")
      .send(voteUpdate)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400: responds with Bad request when inc_votes is NaN", () => {
    const voteUpdate = { inc_votes: "banana" };
    return request(app)
      .patch("/api/articles/banana")
      .send(voteUpdate)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
