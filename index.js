const express = require("express");
const bodyParser = require("body-parser");
const reviewsRouter = require("./routes.js");
const db = require("./db/index.js");

const app = express();

app.use("/reviews", reviewsRouter);

app.listen(3001, () => {
  console.log("listening on port 3001");
});
