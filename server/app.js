const express = require("express");
const bodyParser = require("body-parser");
const reviewsRouter = require("./routes.js");
const path = require("path");

const app = express();

const jsonParser = bodyParser.json();
app.use(jsonParser);

app.use(express.static(path.join(__dirname, "../public")));

app.use("/reviews", reviewsRouter);

// This is the verify tag for the load balancer. It technically should be in the nginx server, not here, but I went past my timebox on figuring out how to serve static fiels via nginx.
app.use("/loaderio-543ddb7ae75c6ca09c7ea0874540763c", (req, res) => {
  res.send("loaderio-543ddb7ae75c6ca09c7ea0874540763c");
});

module.exports = app;
