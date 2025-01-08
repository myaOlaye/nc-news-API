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

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development environment
      "https://my-news-app-489224.netlify.app", // Deployed Netlify app
    ],
    credentials: true,
  })
);

app.options("*", cors());

app.use(cookieParser());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", invalidUrlErrorHandler);

app.use(customErrorHandler);

app.use(postgressErrorHandler);

module.exports = app;
