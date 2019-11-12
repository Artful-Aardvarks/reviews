const express = require("express");
const router = express.Router();
const path = require("path");

const controller = fileName => {
	return require(path.join(__dirname, `./controllers/${fileName}`));
};

router.get("/:product_id/list", controller("getReviews.js"));

router.get("/:product_id/meta", controller("getProductMetaData.js"));

router.post("/:product_id", controller("postNewReview.js"));

router.put("/helpful/:review_id", controller("markReviewAsHelpful.js"));

router.put("/report/:review_id", controller("reportReview.js"));

module.exports = router;
