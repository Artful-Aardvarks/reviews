const characteristics = require("./characteristics.js");
const products = require("./products.js");
const reviews_photos = require("./reviews_photos.js");
const reviews = require("./reviews.js");

characteristics.fixErrors();
products.createCSV();
reviews_photos.fixErrors();
reviews.fixErrors();
