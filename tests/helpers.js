const request = require("supertest");
const app = require("../server/app.js");
const { HOST_ROOT, HOST_PORT } = require("../constants.js");

module.exports = {
	superTest: request(app),
	apiURL: HOST_ROOT + ":" + HOST_PORT,
	typesTest: function(valuesAndTypes) {
		for (let i = 0; i < valuesAndTypes.length; i++) {
			if (valuesAndTypes[i][1] !== "array") {
				if (typeof valuesAndTypes[i][0] !== valuesAndTypes[i][1]) {
					return false;
				}
			} else {
				if (!Array.isArray(valuesAndTypes[i][0])) {
					return false;
				}
			}
		}
		return true;
	},
	randomReviewForProduct: (rating, randomID) => {
		return JSON.stringify({
			rating: rating,
			summary: `Random review: ${randomID}`,
			body: "Test body",
			recommend: false,
			name: "Harry Shapiro",
			email: "harrydshapiro96@gmail.com",
			photos: '["www.testimage.com", "www.anothertestimage.com"]',
			characteristics: '{"68": "2","69": "3","70": "4","71": "5"}'
		});
	}
};
