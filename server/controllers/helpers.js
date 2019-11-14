const fs = require("fs");

module.exports = {
  newAvg: function(newVote, currentAvg, currentVotes) {
    return (currentAvg * currentVotes + newVote) / currentVotes + 1;
  },
  logError: function(errorString, file) {
    const logStream = fs.createWriteStream(`server/error_logs/${file}`, {
      encoding: "utf8",
      flags: "a"
    });
    logStream.write(`${new Date().toString()}: \n ${errorString} \n\n`);
  }
};
