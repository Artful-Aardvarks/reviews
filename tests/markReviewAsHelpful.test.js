const frisby = require("frisby");
const { apiURL } = require("./helpers");

describe("Mark review as helpful", () => {
	const randomReviewID = Math.floor(Math.random() * 10000);
	it("Sends back a 204", () => {
		return frisby
			.put(apiURL + "/reviews/helpful/" + randomReviewID)
			.expect("status", 204);
	});
});
