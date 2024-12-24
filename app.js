const express = require("express");
const apiRouter = require("./routes/api-router");
const cors = require("cors");
const {
  customErrorHandler,
  postgressErrorHandler,
  invalidUrlErrorHandler,
} = require("./controllers/error-controllers");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", invalidUrlErrorHandler);

app.use(customErrorHandler);

app.use(postgressErrorHandler);

module.exports = app;
