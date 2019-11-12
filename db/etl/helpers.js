const fs = require("fs");
const readline = require("readline");

function convertRecommendStringToTinyInt(recommendVal) {
  var trueOptions = ['true', true, '1', 1];
  var falseOptions = ['false', false, '0', 0];
  if (trueOptions.includes(recommendVal)) return 1
  if (falseOptions.includes(recommendVal)) return 0
  return null
}

function removeWrappingQuotationMarks(text) {
  var newText = text + "";
  if (text[0] === '"') newText = newText.slice(1)
  if (text[text.length - 1] === '"') newText = newText.slice(0, newText.length - 2);
  return newText;
}

function replaceTinyIntWithBool(value) {
  if (value === 'true' || value === 'false' || typeof value === 'boolean') return value
  if (value === '1') return true
  if (value === '0') return false
  else return false
}

function arrayFromCSV(text) {
  var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  var a = [];
  text.replace(
    re_value,
    function (m0, m1, m2, m3) {
      if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return "";
    }
  );
  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push("");
  return a;
}

function isValidLine(line, valuesArray, validityTests, forbiddenValues) {
  for (let i = 0; i < valuesArray.length; i++) {
    if (forbiddenValues) {
      if (forbiddenValues[i].includes(valuesArray[i])) {
        return false
      }
    }
    if (!validityTests[i](valuesArray[i])) {
      var errorObj = {
        column: i,
        badVal: valuesArray[i],
      }
      // console.log(`Line ${valuesArray[0]} has error at column ${i}: ${valuesArray[i]} \n ${line} \n`)
      return errorObj
    }
  }
  return true
}

const validIf = {
  typeIs: {
    number: (value) => {
      if (parseInt(value) === NaN) {
        return false
      } else {
        return true
      }
    },
    date: (value) => {
      var date = new Date(value)
      return date instanceof Date && !isNaN(date);
    },
  },
  booleanRepresentedBy: {
    boolean: (value) => {
      if (['false', false, 'true', true].includes(value)) return true
      return false
    },
    tinyInt: (value) => {
      if (['1', 1, '0', 0].includes(value)) return true
      return false
    }
  },
  notFalsy: (value) => {
    if (['null', null, 'undefined', undefined, '0', 0, '1', 1].includes(value)) return false
    return true
  }
}

function logFileErrors(entry, output, readline_log, validityTests = null, forbiddenValues) {
  const entryStream = fs.createReadStream(entry, { encoding: "utf8" });
  const outputStream = fs.createReadStream(output, { encoding: "utf8" });
  const readlineLog = fs.createReadStream(readline_log, { encoding: "utf8" });
  const lineStream = readline.createInterface({
    input: entryStream,
    output: readlineLog
  });
  lineStream.on("line", function (line) {
    const valuesArray = arrayFromCSV(line)
    if (isValidLine(valuesArray, validityTests, forbiddenValues)) {
      outputStream.write(line + '\n')
    }
  })
}

module.exports = {
  convertRecommendStringToTinyInt, logFileErrors, isValidLine, arrayFromCSV, removeWrappingQuotationMarks, replaceTinyIntWithBool, validIf
}
