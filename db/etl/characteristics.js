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
// id,product_id, name
let dirtyCharacteristics = fs.createReadStream(
	__dirname + "/../../raw_data/characteristics.csv",
	{ encoding: "utf8" }
);

let readlineOutputLogging = fs.createWriteStream(
	__dirname + "/../../raw_data/readlineOutputLogging.csv",
	{ encoding: "utf8" }
);

let cleanCharacteristics = fs.createWriteStream(
	__dirname + "/../../clean_data/cleanCharacteristics.csv",
	{ encoding: "utf8" }
);

let characteristicsLineByLine = readline.createInterface({
	input: dirtyCharacteristics,
	output: readlineOutputLogging
});

const characteristicsValidityTests = [
	id => validIf.typeIs.number(id),
	product_id => validIf.typeIs.number(product_id),
	name => validIf.notFalsy(name)
];

module.exports = {
	findErrors: () => {
		let errorsToFix = {};
		characteristicsLineByLine.on("line", function(line) {
			const valuesArray = arrayFromCSV(line);
			const validityResult = isValidLine(
				line,
				valuesArray,
				characteristicsValidityTests
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
		characteristicsLineByLine.on("close", () => {
			console.log(
				"These are the errors that you will need to handle:",
				errorsToFix
			);
		});
	},
	fixErrors: () => {
		characteristicsLineByLine.on("line", function(line) {
			const valuesArray = arrayFromCSV(line);
			valuesArray[2] = removeWrappingQuotationMarks(valuesArray[2]);
			const newLine = valuesArray.join(",");
			cleanCharacteristics.write(newLine + "\n");
		});
		characteristicsLineByLine.on("close", function() {
			console.log("Done uploading clean characteristics");
		});
	}
};
