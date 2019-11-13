const { Reviews, Reviews_Photos } = require("../dbConnection.js");
const Promise = require("bluebird");
const { logError } = require("./helpers.js");

module.exports = async function(req, res) {
  // Establishs variables for querying
  const product_id = parseInt(req.params.product_id);
  const page = parseInt(req.query.page) || 1;
  const count = parseInt(req.query.count) || 5;
  const sort =
    req.query.sort === "newest"
      ? [["created_date", "DESC"]]
      : [["helpfulness", "DESC"]];

  if (typeof product_id !== "number") {
    res.status(400).end();
  }

  try {
    var reviews = await Reviews.findAndCountAll({
      where: { product_id: product_id },
      offset: (page - 1) * count,
      limit: count,
      order: sort
    });
  } catch (err) {
    logError(
      `Error trying to find reviews with product_id ${productID}: \n ${err}`,
      "getReviewsErrors.txt"
    );
    res.status(500).end();
  }

  try {
    var images = await Promise.all(
      reviews.rows.map(async review => {
        return await Reviews_Photos.findAll({
          where: {
            review_id: review.id
          }
        });
      })
    );
  } catch (err) {
    logError(
      `Error trying to find images for product_id ${productID}: \n ${err}`,
      "getReviewsErrors.txt"
    );
    res.status(500).end();
  }

  const reviewsAndImages = [];

  for (let i = 0; i < reviews.rows.length; i++) {
    reviewsAndImages.push(reviews.rows[i].toJSON());
    reviewsAndImages[i].photos = images[i];
  }

  const responseObject = {
    product: product_id,
    page: page,
    count: count,
    results: reviewsAndImages
  };
  res.status(200).send(responseObject);
};
