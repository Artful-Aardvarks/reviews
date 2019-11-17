const express = require("express");
const bodyParser = require("body-parser");
const reviewsRouter = require("./routes.js");
const path = require("path");

const app = express();

const jsonParser = bodyParser.json();
app.use(jsonParser);

app.use(express.static(path.join(__dirname, "../public")));

app.use("/reviews", reviewsRouter);

module.exports = app;
