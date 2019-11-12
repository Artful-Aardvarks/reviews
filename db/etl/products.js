const fs = require("fs");
const readline = require("readline");
const {
	convertRecommendStringToTinyInt,
	arrayFromCSV
} = require("./helpers.js");

// Shape of CSV coming from reviews.csv:
// id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness
let reviewsFile = fs.createReadStream(
	__dirname + "/../../raw_data/reviews.csv",
	{ encoding: "utf8" }
);

// Not a legit file I'll use in the API, just used if readline has anything it wants to tell me.
let readlineOutputLogging = fs.createWriteStream(
	__dirname + "/../../raw_data/readlineOutputLogging.csv",
	{ encoding: "utf8" }
);

// Shape of CSV I'm writing to:
// product_id, recommend, review_count, rating, stars[5], stars[4], stars[3], stars[2], stars[1]
let productsFile = fs.createWriteStream(
	__dirname + "/../../clean_data/products.csv",
	{ encoding: "utf8" }
);

let reviewsLineByLine = readline.createInterface({
	input: reviewsFile,
	output: readlineOutputLogging
});

module.exports = {
	createCSV: function() {
		const productsCache = {};

		function initiateNewProductInCache(id, product_id, rating, recommend) {
			productsCache[product_id] = {
				rating,
				recommend,
				review_count: 1,
				stars: {
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0
				}
			};
			productsCache[product_id].stars[rating] = 1;
		}

		function updateProductInCache(id, product_id, rating, recommend) {
			let currentreview_count = productsCache[product_id].review_count;
			let newreview_count = currentreview_count + 1;
			let currentRating = productsCache[product_id].rating;
			var newRating =
				(rating + currentRating * currentreview_count) / newreview_count;
			productsCache[product_id].rating = newRating;
			productsCache[product_id].review_count = newreview_count;
			productsCache[product_id].recommend += recommend;
			productsCache[product_id].stars[rating]++;
		}

		reviewsLineByLine.on("line", line => {
			lineCounter++;
			const lineSplit = arrayFromCSV(line);
			const id = parseInt(lineSplit[0]);
			const product_id = parseInt(lineSplit[1]);
			const rating = parseInt(lineSplit[2]);
			let recommend = convertRecommendStringToTinyInt(lineSplit[6]);
			if (!productsCache[product_id]) {
				initiateNewProductInCache(id, product_id, rating, recommend);
			} else {
				updateProductInCache(id, product_id, rating, recommend);
			}
		});

		reviewsLineByLine.on("close", function() {
			for (let product in productsCache) {
				let { rating, recommend, review_count, stars } = productsCache[product];
				var string = [
					product,
					recommend,
					review_count,
					rating,
					stars[5],
					stars[4],
					stars[3],
					stars[2],
					stars[1]
				].join(",");
				productsFile.write(string + "\n");
			}
			console.log("Done uploading clean products");
		});
	}
};
