const Promise = require("bluebird");

const { newAvg, logError } = require("./helpers.js");

const {
	Products,
	Reviews,
	Characteristic_Reviews,
	Reviews_Photos
} = require("../dbConnection.js");

module.exports = async function(req, res) {
	const product_id = req.params.product_id;

	let {
		rating,
		summary,
		body,
		recommend,
		name,
		email,
		photos,
		characteristics
	} = req.body;
	if (typeof photos === "string") photos = JSON.parse(photos);
	if (typeof characteristics === "string")
		characteristics = JSON.parse(characteristics);

	// update products
	const productQuery = await Products.findOne({
		where: {
			id: product_id
		}
	})
		.catch(err => {
			logError(
				`Error trying to find produdct ${product_id}: \n`,
				"postNewReviewErrors.txt"
			);
			res.status(500).end();
		})
		.then(currentProd => {
			Products.update(
				{
					rating: newAvg(rating, currentProd.rating, currentProd.review_count),
					review_count: currentProd.review_count + 1,
					five_star:
						rating === 5 ? currentProd.five_star + 1 : currentProd.five_star,
					four_star:
						rating === 4 ? currentProd.five_star + 1 : currentProd.four_star,
					three_star:
						rating === 3 ? currentProd.five_star + 1 : currentProd.three_star,
					two_star:
						rating === 2 ? currentProd.five_star + 1 : currentProd.two_star,
					one_star:
						rating === 1 ? currentProd.five_star + 1 : currentProd.one_star
				},
				{
					where: {
						id: product_id
					}
				}
			);
		})
		.catch(err => {
			logError(
				`Error trying to update produdct ${product_id}:`,
				"postNewReviewErrors.txt"
			);
			res.status(500).end();
		});
	//This query is blocking because we need to wait to get the reviewID before we do the other queries
	const reivewsQuery = await Reviews.build({
		product_id,
		rating,
		created_date: new Date(),
		summary,
		body,
		recommend: recommend ? 1 : 0,
		reported: 0,
		reviewer_name: name,
		reviewer_email: email,
		response: "",
		helpfulness: 0
	}).save();

	const reviewID = reivewsQuery.id;

	const charsArray = Object.entries(characteristics);

	const characteristicsQuery = Promise.all(
		charsArray.map(idValPair => {
			Characteristic_Reviews.build({
				characteristic_id: idValPair[0],
				value: idValPair[1]
			})
				.save()
				.then(() => {
					throw new Error();
				})
				.catch(err => {
					logError(
						`Error trying to add characteristic_review. Review: ${reviewID}; Characteristic: ${
							idValPair[0]
						}; Value: ${idValPair[1]}`,
						"postNewReviewErrors.txt"
					);
				});
		})
	);

	const photosQuery = Promise.all(
		photos.map(photoURL => {
			Reviews_Photos.build({
				review_id: reviewID,
				image_url: photoURL
			})
				.save()
				.catch(err => {
					logError(
						`Error trying to add photo. Review: ${reviewID}; Photo: ${photoURL}`,
						"postNewReviewErrors.txt"
					);
				});
		})
	);

	await Promise.all([productQuery, characteristicsQuery, photosQuery]); // Waiting for data storage to finish before we send the 201
	res.status(201).send();
};
