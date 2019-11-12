const { Reviews, Reviews_Photos } = require("../dbConnection.js");
const Promise = require("bluebird");
const { logError } = require("./helpers.js");

module.exports = async function(req, res) {
	const product_id = parseInt(req.params.product_id);
	const page = parseInt(req.query.page) || 1;
	const count = parseInt(req.query.count) || 5;
	const sort = req.query.sort; // TODO: Need to set up sorting
	const reviews = [];
	debugger;
	const order =
		sort === "newest" ? [["created_date", "DESC"]] : [["helpfulness", "DESC"]];
	console.log("order:", order);
	const findAllResults = await Reviews.findAndCountAll({
		where: { product_id: product_id },
		offset: (page - 1) * count,
		limit: count,
		order: order
	}).catch(err => {
		logError(
			`Error trying to find reviews with product_id ${productID}: \n ${err}`,
			"getReviewsErrors.txt"
		);
		res.status(500).end();
	});
	const images = await Promise.all(
		findAllResults.rows.map(async review => {
			return await Reviews_Photos.findAll({
				where: {
					review_id: review.id
				}
			});
		})
	).catch(err => {
		logError(
			`Error trying to find images for product_id ${productID}: \n ${err}`,
			"getReviewsErrors.txt"
		);
		res.status(500).end();
	});
	for (let i = 0; i < findAllResults.rows.length; i++) {
		reviews.push(findAllResults.rows[i].toJSON());
		reviews[i].photos = images[i];
	}
	const responseObject = {
		product: product_id,
		page: page,
		count: count,
		results: reviews
	};
	res.status(200).send(responseObject);
};
