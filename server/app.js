const express = require("express");
const bodyParser = require("body-parser");
const reviewsRouter = require("./routes.js");

const app = express();

const jsonParser = bodyParser.json();
app.use(jsonParser);

app.use("/reviews", reviewsRouter);

module.exports = app;
