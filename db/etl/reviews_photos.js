const fs = require("fs");
const readline = require("readline");
const { isValidLine, arrayFromCSV, removeWrappingQuotationMarks, replaceTinyIntWithBool, validIf } = require("./helpers.js")

// Shape of CSV coming from reviews.csv: 
// id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness
let dirtyPhotos = fs.createReadStream(__dirname + "/../../raw_data/reviews_photos.csv", { encoding: "utf8" });

let readlineOutputLogging = fs.createWriteStream(__dirname + "/../../raw_data/readlineOutputLogging.csv", { encoding: "utf8" });

let cleanPhotos = fs.createWriteStream(__dirname + "/../../clean_data/reviews_photos.csv", { encoding: "utf8", });

let photosLineByLine = readline.createInterface({
  input: dirtyPhotos,
  output: readlineOutputLogging
});

const photosValidityTest = [
  (id) => validIf.typeIs.number(id),
  (review_id) => validIf.typeIs.number(review_id),
  (image_url) => validIf.notFalsy(image_url),
]

module.exports = {
  findErrors: () => {
    let errorsToFix = {};
    photosLineByLine.on("line", function (line) {
      const valuesArray = arrayFromCSV(line);
      const validityResult = isValidLine(line, valuesArray, photosValidityTest);
      var { column, badVal } = validityResult
      if (validityResult !== true) {
        if (!errorsToFix[column]) {
          errorsToFix[column] = [badVal]
        } else {
          if (!errorsToFix[column].includes(badVal)) {
            errorsToFix[column].push(badVal)
          }
        }
      }
    })
    photosLineByLine.on("close", () => {
      console.log("These are the errors that you will need to handle:", errorsToFix)
    })
  },
  fixErrors: () => {
    photosLineByLine.on("line", function (line) {
      const valuesArray = arrayFromCSV(line);
      // remove quotation marks
      valuesArray[2] = removeWrappingQuotationMarks([valuesArray[2]])
      const newLine = valuesArray.join(',')
      cleanPhotos.write(newLine + '\n')
    })
    photosLineByLine.on("close", function () {
      console.log("Done uploading clean photos")
    })
  }
}