const Sequelize = require("sequelize");
const { Products, sequelize } = require("../dbConnection.js");
const Promise = require("bluebird");
const { logError } = require("./helpers.js");

module.exports = async function(req, res) {
	const product_id = getProductId(req);
	const [metadata, characteristics] = await Promise.all([
		getMetadata(product_id),
		getCharacteristics(product_id)
	]);
	const responseObject = constructResponseObject(
		product_id,
		metadata,
		characteristics
	);
	res.status(200).send(responseObject);
};

/////////////////////////////////////////////////////////////

function getProductId(req) {
	return req.params.product_id;
}

function getMetadata(productID) {
	return Products.findOne({
		where: {
			id: productID
		}
	}).catch(err => {
		logError(
			`Error trying to find produdct ${productID}: \n ${err}`,
			"getProductMetadataErrors.txt"
		);
	});
}

function getCharacteristics(productID) {
	return sequelize
		.query(
			`SELECT
      c.id, c.name, c_r.value
    FROM  
      characteristics c 
    INNER JOIN  
      characteristic_reviews c_r 
    ON  
      c.id = c_r.characteristic_id 
    WHERE  
      c.product_id = ${productID}`,
			{ type: Sequelize.QueryTypes.SELECT } // Without including this option, sequelize will send an array containing the query results twice.
		)
		.catch(err => {
			logError(
				`Error trying to find produdct ${productID}: \n ${err}`,
				"getProductMetadataErrors.txt"
			);
		});
}

function constructResponseObject(product_id, metadata, characteristics) {
	const responseObject = {
		product_id,
		recommend: {
			0: metadata.review_count - metadata.recommend,
			1: metadata.recommend
		},
		ratings: {
			1: metadata.one_star,
			2: metadata.two_star,
			3: metadata.three_star,
			4: metadata.four_star,
			5: metadata.five_star
		},
		characteristics: {}
	};
	for (let i = 0; i < characteristics.length; i++) {
		const characteristic =
			responseObject.characteristics[characteristics[i].name];
		if (!characteristic) {
			responseObject.characteristics[characteristics[i].name] =
				characteristics[i];
			responseObject.characteristics[characteristics[i].name].votes = 1;
		} else {
			const currentValue = characteristic.value;
			const newValue =
				(currentValue * characteristic.votes + characteristics[i].value) /
				(characteristic.votes + 1);
			const newVotes = characteristic.votes + 1;
			responseObject.characteristics[characteristics[i].name].value = newValue;
			responseObject.characteristics[characteristics[i].name].votes = newVotes;
		}
	}
	for (let prop in responseObject.characteristics) {
		delete responseObject.characteristics[prop].votes;
	}
	return responseObject;
}
