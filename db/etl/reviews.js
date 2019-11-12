const fs = require("fs");
const readline = require("readline");
const {
	isValidLine,
	arrayFromCSV,
	removeWrappingQuotationMarks,
	replaceTinyIntWithBool,
	validIf
} = require("./helpers.js");

// Shape of CSV coming from reviews.csv:
// id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness
let dirtyReviews = fs.createReadStream(
	__dirname + "/../../raw_data/reviews.csv",
	{ encoding: "utf8" }
);

let readlineOutputLogging = fs.createWriteStream(
	__dirname + "/../../raw_data/readlineOutputLogging.csv",
	{ encoding: "utf8" }
);

// id, product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness
let cleanReviews = fs.createWriteStream(
	__dirname + "/../../clean_data/reviews.csv",
	{ encoding: "utf8" }
);

let reviewsLineByLine = readline.createInterface({
	input: dirtyReviews,
	output: readlineOutputLogging
});

const reviewsValidityTests = [
	id => validIf.typeIs.number(id),
	product_id => validIf.typeIs.number(product_id),
	rating => {
		var parsedVal = parseInt(rating);
		if (!parsedVal) return false;
		if (parsedVal > 5 || parsedVal < 1) return false;
		return true;
	},
	date => validIf.typeIs.date(date),
	summary => validIf.notFalsy(summary),
	body => validIf.notFalsy(body),
	recommend => validIf.booleanRepresentedBy.boolean(recommend),
	reported => validIf.booleanRepresentedBy.boolean(reported),
	reviewer_name => validIf.notFalsy(reviewer_name),
	reviewer_email => validIf.notFalsy(reviewer_email),
	response => {
		return ["undefined", undefined].includes(response) ? false : true;
	},
	helpfulness => validIf.typeIs.number(helpfulness)
];

module.exports = {
	findErrors: () => {
		let errorsToFix = {};
		reviewsLineByLine.on("line", function(line) {
			const valuesArray = arrayFromCSV(line);
			const validityResult = isValidLine(
				line,
				valuesArray,
				reviewsValidityTests
			);
			var { column, badVal } = validityResult;
			if (validityResult !== true) {
				if (!errorsToFix[column]) {
					errorsToFix[column] = [badVal];
				} else {
					if (!errorsToFix[column].includes(badVal)) {
						errorsToFix[column].push(badVal);
					}
				}
			}
		});
		reviewsLineByLine.on("close", () => {
			console.log(
				"These are the errors that you will need to handle:",
				errorsToFix
			);
		});
	},
	fixErrors: () => {
		reviewsLineByLine.on("line", function(line) {
			const valuesArray = arrayFromCSV(line);
			// remove quotation marks
			valuesArray[3] = removeWrappingQuotationMarks([valuesArray[3]]);
			valuesArray[4] = removeWrappingQuotationMarks([valuesArray[4]]);
			valuesArray[5] = removeWrappingQuotationMarks([valuesArray[5]]);
			const newLine = valuesArray.join(",");
			cleanReviews.write(newLine + "\n");
		});
		reviewsLineByLine.on("close", function() {
			console.log("Done uploading clean reviews");
		});
	}
};
