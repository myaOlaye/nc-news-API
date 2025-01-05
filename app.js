const express = require("express");
const apiRouter = require("./routes/api-router");
const cors = require("cors");
const {
  customErrorHandler,
  postgressErrorHandler,
  invalidUrlErrorHandler,
} = require("./controllers/error-controllers");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());

app.use(cookieParser());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", invalidUrlErrorHandler);

app.use(customErrorHandler);

app.use(postgressErrorHandler);

module.exports = app;
