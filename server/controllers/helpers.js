const fs = require("fs");

module.exports = {
	newAvg: function(newVote, currentAvg, currentVotes) {
		return (currentAvg * currentVotes + newVote) / currentVotes + 1;
	},
	logError: function(errorString, file) {
		fs.writeFile(
			`./server/controllers/error_logs/${file}`,
			`${new Date().toString()}: \n ${errorString} \n\n`,
			{
				encoding: "utf8",
				flags: "a"
			},
			err => {
				console.log(
					"Error encountered when trying to log error to postNewReviewErrors.txt",
					err
				);
			}
		);
	}
};
