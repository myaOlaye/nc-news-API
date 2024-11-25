const express = require("express");
const { getApi } = require("./controllers/getApi");

const app = express();
app.use(express.json());

app.get("/api", getApi);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   //   res.status(500).send("Something went wrong!");
// });

module.exports = app;
