const frisby = require("frisby");
const { apiURL, typesTest } = require("./helpers");

describe("Get metadata for a product", () => {
	const randomProductID = Math.floor(Math.random() * 100000);
	it("Should return a 200", () => {
		return frisby
			.get(`${apiURL}/reviews/${randomProductID}/meta`)
			.expect("status", 200);
	});
	it("Should return all of the expected properties with their proper types", () => {
		return frisby
			.get(`${apiURL}/reviews/${randomProductID}/meta`)
			.expect("status", 200)
			.then(({ json: { product_id, ratings, recommend, characteristics } }) => {
				let firstCharacteristic;
				for (let prop in characteristics) {
					firstCharacteristic = characteristics[prop];
				}
				const types = [
					[parseInt(product_id), "number"],
					[ratings, "object"],
					[ratings[1], "number"],
					[ratings[2], "number"],
					[ratings[3], "number"],
					[ratings[4], "number"],
					[ratings[5], "number"],
					[recommend, "object"],
					[recommend[0], "number"],
					[recommend[1], "number"],
					[characteristics, "object"],
					[firstCharacteristic.id, "number"],
					[firstCharacteristic.value, "number"]
				];
				expect(typesTest(types)).toBe(true);
			});
	});
});
