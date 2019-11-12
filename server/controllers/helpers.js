const fs = require("fs");

module.exports = {
  newAvg: function(newVote, currentAvg, currentVotes) {
    return (currentAvg * currentVotes + newVote) / currentVotes + 1;
  },
  logError: function(errorString, file) {
    console.log("error logging:", arguments);
    const writeStream = fs.createWriteStream(`server/error_logs/${file}`, {
      encoding: "utf8",
      flags: "a"
    });
    writeStream.write(`${new Date().toString()}: \n ${errorString} \n\n`);
  }
};
