const frisby = require("frisby");
const { apiURL } = require("./helpers");

describe("Report Review", () => {
	const randomReviewID = Math.floor(Math.random() * 10000);
	it("Sends back a 204", () => {
		return frisby
			.put(apiURL + "/reviews/report/" + randomReviewID)
			.expect("status", 204);
	});
});
