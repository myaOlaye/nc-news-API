const express = require("express");
const { badUrlErrorHandler } = require("./controllers/error-controllers");
const { getApi, getTopics } = require("./controllers/get-controllers");

const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("*", badUrlErrorHandler);

module.exports = app;
