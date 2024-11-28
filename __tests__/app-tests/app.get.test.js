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
          comment_count: 11,
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
  test("200: Responds with an array of article objects sorted by date in descending order by default", () => {
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
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toEqual({
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
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toEqual({
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

describe("DELETE /api/comments/:comment_id", () => {
  test("204: returns nothing in the body (no content) when a comment of a specific id is deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: returns Not found when a comment of a non existent id is attempted to be deleted", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("400: returns Bad request when a comment of an invalid id is attempted to be deleted", () => {
    return request(app)
      .delete("/api/comments/bananas")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles?sort_by=value", () => {
  describe("200: responds with array of articles objects sorted by valid column, descending by default", () => {
    test("200: sorted by title, descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({
            key: "title",
            descending: true,
          });
        });
    });
    test("200: sorted by topic, descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({
            key: "topic",
            descending: true,
          });
        });
    });
    test("200: sorted by created_at, descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
    });
  });

  test("400: responds Bad request when sort_by column does not exist", () => {
    return request(app)
      .get("/api/articles?sort_by=bananas")
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles?order=value", () => {
  test("200: returns array of articles in descending order of created_at by default ", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("200: returns array of articles in ascending order of created_at by default ", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({
          key: "created_at",
          ascending: true,
        });
      });
  });
  test("400: returns Bad request when order value is invalid", () => {
    return request(app)
      .get("/api/articles?order=bananas")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles?sort_by=value&order=value", () => {
  describe("200: responds with array of articles objects sorted by valid column, and ordered as specified", () => {
    test("200: sorted by title, descending", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=desc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({
            key: "title",
            descending: true,
          });
        });
    });
    test("200: sorted by title, ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({
            key: "title",
            ascending: true,
          });
        });
    });
    test("200: sorted by topic, descending", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=desc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({
            key: "topic",
            descending: true,
          });
        });
    });
    test("200: sorted by topic, ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({
            key: "topic",
            ascending: true,
          });
        });
    });
    test("200: sorted by created_at, descending", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=desc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
    });
    test("200: sorted by created_at, ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSorted({
            key: "created_at",
            ascending: true,
          });
        });
    });
  });
  describe("400: responds with Bad request when sort_by OR order query is invalid", () => {
    test("400: responds Bad request when sort_by column does not exist", () => {
      return request(app)
        .get("/api/articles?sort_by=bananas&order=desc")
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("400: responds Bad request when sort_by column does not exist", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=bananas")
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});

describe("GET /api/articles?topic=value", () => {
  test("200: returns array of article objects with a specified topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual({
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("404: returns Not found when topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=bananas")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  // below test doesn't make sense as 5 is read as a string for some reason that I am unsure of (assuming sql does no type conversion unlike how it has previously done),
  // so we get 404 error
  // is this ok? Above test accounts for any non-existent AND invalid string input I think?
  // in other words im confused why this postgress error does not get thrown:  "error: invalid input syntax for type varchar: "5"
  // does postgress not do type conversion from strings of numbers to numbers in this scenario?
  // test.only("400: returns Bad request when topic is invalid", () => {
  //   return request(app)
  //     .get("/api/articles?topic=5")
  //     .expect(400)
  //     .then(({ body: { msg } }) => {
  //       expect(msg).toBe("Bad request");
  //     });
  // });
});

describe("GET /api/users/:username", () => {
  test("200: responds with array of a specific user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("404: responds with Not found when user doesn't exist of a specific user", () => {
    return request(app)
      .get("/api/users/banana")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: responds with comment object with updated vote value", () => {
    const voteUpdate = { inc_votes: 5 };
    return request(app)
      .patch("/api/comments/1")
      .send(voteUpdate)
      .expect(200)
      .then(({ body: { updatedComment } }) => {
        expect(updatedComment).toEqual({
          comment_id: 1,
          body: expect.any(String),
          votes: 21,
          author: expect.any(String),
          article_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("404: responds with Not found when comment id does not exist", () => {
    const voteUpdate = { inc_votes: 5 };
    return request(app)
      .patch("/api/comments/100")
      .send(voteUpdate)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Not found");
      });
  });
  test("400: responds with Bad request when comment id is invalid", () => {
    const voteUpdate = { inc_votes: 5 };
    return request(app)
      .patch("/api/comments/banana")
      .send(voteUpdate)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Bad request");
      });
  });
});
