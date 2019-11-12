const frisby = require("frisby");
const { apiURL, typesTest } = require("./helpers");

describe("Get list of reviews for a product", () => {
	const randomProductID = Math.floor(Math.random() * 100000);
	it("Should return a 200", () => {
		return frisby
			.get(`${apiURL}/reviews/${randomProductID}/list`)
			.expect("status", 200);
	});
	it("Should return all of the expected properties with their proper types", () => {
		return frisby
			.get(`${apiURL}/reviews/${randomProductID}/list`)
			.expect("status", 200)
			.then(({ json: { product, page, count, results } }) => {
				const randomReview =
					results[Math.floor(Math.random() * (results.length - 1))];
				const types = [
					[product, "number"],
					[page, "number"],
					[count, "number"],
					[results, "array"],
					[randomReview.id, "number"],
					[randomReview.product_id, "number"],
					[randomReview.rating, "number"],
					[randomReview.recommend, "boolean"],
					[randomReview.created_date, "string"],
					[randomReview.summary, "string"],
					[randomReview.body, "string"],
					[randomReview.reported, "boolean"],
					[randomReview.reviewer_email, "string"],
					[randomReview.reviewer_name, "string"],
					[randomReview.response, "string"],
					[randomReview.helpfulness, "number"],
					[randomReview.photos, "array"]
				];
				expect(typesTest(types)).toBe(true);
			});
	});
});
