const frisby = require("frisby");
const { apiURL, typesTest, randomReviewForProduct } = require("./helpers");

describe("Post a new product review", () => {
	const randomProductID = Math.floor(Math.random() * 10000);
	const randomRating = Math.floor(Math.random() * 5);
	const randomReviewID = Math.random();
	it("Should return a 200", () => {
		// prettier-ignore
		return frisby
      .fetch(`${apiURL}/reviews/${randomProductID}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          "rating" : randomRating,
          "photos" : ["url1", "url2"],
          "summary": `Summary id: ${randomReviewID}`,
          "body" : "test body",
          "recommend" : true,
          "name" : "test name",
          "email" : "test email",
          "characteristics" : {5: 4}
        })
      })
      .expect("status", 201)
      .then(() => {
        return frisby
          .get(`${apiURL}/reviews/${randomProductID}/list?sort=newest`)
          .then(({json: reviews}) => {
            expect(reviews.results[0].summary).toBe(`Summary id: ${randomReviewID}`)
          })
      });
	});
});
