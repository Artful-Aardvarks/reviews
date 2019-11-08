const fs = require("fs");
const readline = require("readline");

const readableStream = fs.createReadStream(
	__dirname + "/../raw_data/reviews.csv",
	{
		encoding: "utf8"
	}
);

const outputStream = fs.createWriteStream(
	__dirname + "/../raw_data/outputStream.csv",
	{
		encoding: "utf8"
	}
);

const writeableStream = fs.createWriteStream(
	__dirname + "/../raw_data/writeTest.csv",
	{
		encoding: "utf8",
		// flags: 'a' //appends the data instead of writing a new file	
	}
);

const lineByLine = readline.createInterface({
	input: readableStream,
	output: outputStream
});

const productsCache = {};

// id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness

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

function convertRecommendStringToBool(recommendVal) {
	var trueOptions = ['true', true, '1', 1];
	var falseOptions = ['false', false, '0', 0];
	if (trueOptions.includes(recommendVal)) return 1
	if (falseOptions.includes(recommendVal)) return 0
	return null
}

function initiateNewProductInCache(id, product_id, rating, recommend) {
	productsCache[product_id] = {
		rating,
		recommend,
		review_count: 1,
		five_star: rating === 5 ? 1 : 0,
		four_star: rating === 4 ? 1 : 0,
		three_star: rating === 3 ? 1 : 0,
		two_star: rating === 2 ? 1 : 0,
		one_star: rating === 1 ? 1 : 0
	};
}

function updateProductInCache(id, product_id, rating, recommend) {
	let currentreview_count = productsCache[product_id].review_count;
	let newreview_count = currentreview_count + 1;
	let currentRating = productsCache[product_id].rating;
	var newRating = (rating + (currentRating * currentreview_count)) / newreview_count;
	productsCache[product_id].rating = newRating;
	productsCache[product_id].review_count = newreview_count;
	productsCache[product_id].recommend += recommend;
}

let lineCounter = 0;

console.time("lineReading")

// run this to start updating the productsCache obj
lineByLine.on("line", line => {
	lineCounter++;
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

// when the productsCache obj is done, parse it into single lines and insert them into an awaiting CSV
lineByLine.on("close", function () {
	for (let product in productsCache) {
		let { rating, recommend, review_count } = productsCache[product]
		var string = `product_id: ${product}, rating: ${rating}, recommend: ${recommend}, review count: ${review_count}`;
		writeableStream.write(string + '\n');
	}
	console.timeEnd("lineReading");
});
