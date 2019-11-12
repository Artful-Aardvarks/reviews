const { Reviews } = require("../dbConnection");
const { logError } = require("./helpers");

module.exports = async function(req, res) {
	const review_id = req.params.review_id;
	try {
		await Reviews.update(
			{
				reported: 1
			},
			{
				where: {
					id: review_id
				}
			}
		);
		res.status(204).end();
	} catch (err) {
		logError(
			`Error marking review ${review_id} as reported. Error: \n ${err}`,
			"reportReviewErrors.txt"
		);
		res.status(500).end();
	}
};
