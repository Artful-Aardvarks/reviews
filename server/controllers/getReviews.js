const { Reviews, Reviews_Photos } = require("../dbConnection.js");
const Promise = require("bluebird");
const { logError } = require("./helpers.js");

module.exports = async function(req, res) {
  const { product_id, page, count, sort } = getQueryVariables(req);
  if (!product_id) {
    res.status(400).end();
    return;
  }
  const reviews = await getAllReviews(product_id, page, count, sort);
  const images = await getAllImages(reviews.rows);
  if (
    reviews === undefined ||
    reviews === null ||
    images === undefined ||
    images === null
  ) {
    res.status(500).end();
    return;
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

/* ********************************************************
	Helper functions are below.

	getAllReviews and getAllImages return either an array of their results or undefined if there was an err. 

*/

function getQueryVariables(req) {
  const product_id = parseInt(req.params.product_id);
  const page = parseInt(req.query.page) || 1;
  const count = parseInt(req.query.count) || 5;
  const sort =
    req.query.sort === "newest"
      ? [["created_date", "DESC"]]
      : [["helpfulness", "DESC"]];
  return {
    product_id,
    page,
    count,
    sort
  };
}

async function getAllReviews(product_id, page, count, sort) {
  let reviews;
  try {
    reviews = await Reviews.findAndCountAll({
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
  }
  return reviews;
}

async function getAllImages(reviews) {
  let images;
  try {
    images = await Promise.all(
      reviews.map(async review => {
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
  }
  return images;
}
