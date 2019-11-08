const fs = require("fs");
const readline = require("readline");

// Shape of CSV coming from reviews.csv: 
// id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness
const reviewsFile = fs.createReadStream(
	__dirname + "/../raw_data/reviews.csv",
	{
		encoding: "utf8"
	}
);

// Not a legit file I'll use in the API, just used if readline has anything it wants to tell me.
const readlineOutputLogging = fs.createWriteStream(
	__dirname + "/../raw_data/readlineOutputLogging.csv",
	{
		encoding: "utf8"
	}
);

// Shape of CSV I'm writing to:
// product_id, recommend, review_count, rating, stars[5], stars[4], stars[3], stars[2], stars[1]
const productsFile = fs.createWriteStream(
	__dirname + "/../raw_data/writeTest.csv",
	{
		encoding: "utf8",
		// flags: 'a' //appends the data instead of writing a new file	
	}
);

const reviewsLineByLine = readline.createInterface({
	input: reviewsFile,
	output: readlineOutputLogging
});

function CSVtoArray(text) {
	var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
	var a = []; // Initialize array to receive values.
	text.replace(
		re_value, // "Walk" the string using replace with callback.
		function (m0, m1, m2, m3) {
			// Remove backslash from \' in single quoted values.
			if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
			// Remove backslash from \" in double quoted values.
			else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
			else if (m3 !== undefined) a.push(m3);
			return ""; // Return empty string.
		}
	);
	// Handle special case of empty last value.
	if (/,\s*$/.test(text)) a.push("");
	return a;
}

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
			5: 0,
		}
	};
	productsCache[product_id].stars[rating] = 1
}

function updateProductInCache(id, product_id, rating, recommend) {
	let currentreview_count = productsCache[product_id].review_count;
	let newreview_count = currentreview_count + 1;
	let currentRating = productsCache[product_id].rating;
	var newRating = (rating + (currentRating * currentreview_count)) / newreview_count;
	productsCache[product_id].rating = newRating;
	productsCache[product_id].review_count = newreview_count;
	productsCache[product_id].recommend += recommend;
	productsCache[product_id].stars[rating]++
}

function convertRecommendStringToBool(recommendVal) {
	var trueOptions = ['true', true, '1', 1];
	var falseOptions = ['false', false, '0', 0];
	if (trueOptions.includes(recommendVal)) return 1
	if (falseOptions.includes(recommendVal)) return 0
	return null
}

let lineCounter = 0;

const productsCache = {};

console.time('creating products table')

reviewsLineByLine.on("line", line => {
	lineCounter++;
	if (lineCounter > 100) reviewsLineByLine.close();
	const lineSplit = CSVtoArray(line);
	const id = parseInt(lineSplit[0]);
	const product_id = parseInt(lineSplit[1]);
	const rating = parseInt(lineSplit[2]);
	let recommend = convertRecommendStringToBool(lineSplit[6]);
	if (!productsCache[product_id]) {
		initiateNewProductInCache(id, product_id, rating, recommend)
	} else {
		updateProductInCache(id, product_id, rating, recommend)
	}
});

reviewsLineByLine.on("close", function () {
	for (let product in productsCache) {
		let { rating, recommend, review_count, stars } = productsCache[product]
		var string = [product, recommend, review_count, rating, stars[5], stars[4], stars[3], stars[2], stars[1]].join(',');
		productsFile.write(string + '\n');
	}
	console.timeEnd('creating products table')
});
