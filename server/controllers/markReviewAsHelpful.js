const { Reviews } = require("../dbConnection");
const { logError } = require("./helpers");

module.exports = async function(req, res) {
	const review_id = req.params.review_id;
	if (typeof parseInt(review_id) !== 'number') {
		res.status(400).end()
	}
	try {
		await Reviews.increment("helpfulness", {
			where: {
				id: review_id
			}
		});
		res.status(204).end();
	} catch (err) {
		logError(
			`Error marking review ${review_id} as helpful. Error: \n ${err}`,
			"markAsHelpfulErrors.txt"
		);
		res.status(500).end();
	}
};
