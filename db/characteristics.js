const models = require("./index.js");

const findById = id => {
	Characteristics.findOne({ where: { id: id } }).then(result =>
		console.log(`Found characteristic with id ${id}:`, result)
	);
};

module.exports = { findById };
