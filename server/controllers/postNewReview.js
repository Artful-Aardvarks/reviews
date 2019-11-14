const Promise = require("bluebird");

const { newAvg, logError } = require("./helpers.js");

const {
  Products,
  Reviews,
  Characteristic_Reviews,
  Reviews_Photos
} = require("../dbConnection.js");

module.exports = async function(req, res) {
  const product_id = req.params.product_id;

  let { rating, recommend, photos, characteristics } = req.body;

  [photos, characteristics] = parseDataIfNeeded(photos, characteristics);

  if (invalidInputs(product_id, rating, recommend, photos, characteristics)) {
    res.status(400).end();
    return;
  }

  const productUpdateQuery = updateProductInDb(product_id, rating, recommend);

  const { id: reviewID } = await addReviewToDB(product_id, req.body);

  const charsArray = Object.entries(characteristics);

  await Promise.all([
    productUpdateQuery, // Since this request does not rely on reviewID, it is started before the blocking invocation of addReviewToDB to give it a jumpstart
    addCharacteristicsToDB(charsArray, reviewID),
    addPhotosToDB(photos, reviewID)
  ]);

  res.status(201).send();
};

/* ********************************************************
	Helper functions are below.

	invalidInputs will return TRUE if there ARE invalid inputs from the POST request, and FALSE if there ARE NOT invalid inputs

	parseDataIfNeed accepts individual args that may be either stringified arrays or objects, and returns them as an array of parsed arrays/objects. You should probably just destructure the returned results.

	updateProductInDb first finds a product (necessary so that we can get its current info so that we know how to update it), and and returns a promise that fulfills when the product has been added. The resolve value is an object representing that sequelize Model instance.

	addReviewToDB accepts a product id and req.body, which it destructures (really can be any obejct with the appropriate props), and returns a promise that fulfills when the new review has been added to the database

	addPhotosToDB and addCharacteristicsToDB function similarly to addReviewToDB

*/

function invalidInputs(product_id, rating, recommend, photos, characteristics) {
  const conditionsThatShouldBeTruthy = [
    parseInt(product_id),
    parseInt(rating),
    typeof recommend === "boolean",
    Array.isArray(photos) || photos === undefined,
    typeof characteristics === "object" || characteristics === undefined
  ];
  for (let i = 0; i < conditionsThatShouldBeTruthy.length; i++) {
    if (!conditionsThatShouldBeTruthy[i]) {
      return true;
    }
  }
  return false;
}

function parseDataIfNeeded(...dataThatShouldntBeAString) {
  for (let i = 0; i < dataThatShouldntBeAString.length; i++) {
    if (typeof dataThatShouldntBeAString[i] === "string") {
      try {
        dataThatShouldntBeAString[i] = JSON.parse(dataThatShouldntBeAString[i]);
      } catch (err) {
        dataThatShouldntBeAString[i] = undefined;
      }
    }
  }
  return dataThatShouldntBeAString;
}

function updateProductInDb(product_id, rating, recommend) {
  return Products.findOne({
    where: {
      id: product_id
    }
  })
    .then(currentProd => {
      return Products.update(
        {
          rating: newAvg(rating, currentProd.rating, currentProd.review_count),
          review_count: currentProd.review_count + 1,
          five_star:
            rating === 5 ? currentProd.five_star + 1 : currentProd.five_star,
          four_star:
            rating === 4 ? currentProd.five_star + 1 : currentProd.four_star,
          three_star:
            rating === 3 ? currentProd.five_star + 1 : currentProd.three_star,
          two_star:
            rating === 2 ? currentProd.five_star + 1 : currentProd.two_star,
          one_star:
            rating === 1 ? currentProd.five_star + 1 : currentProd.one_star,
          recommend:
            recommend === true
              ? currentProd.recommend + 1
              : currentProd.recommend
        },
        {
          where: {
            id: product_id
          }
        }
      );
    })
    .catch(err => {
      logError(
        `Error trying to update produdct ${product_id}:`,
        "postNewReviewErrors.txt"
      );
    });
}

function addReviewToDB(
  product_id,
  { rating, summary, body, recommend, name, email }
) {
  return Reviews.create({
    product_id,
    rating,
    summary,
    body,
    recommend: recommend ? 1 : 0,
    reviewer_name: name,
    reviewer_email: email,
    created_date: new Date(),
    reported: 0,
    response: "",
    helpfulness: 0
  });
}

function addCharacteristicsToDB(charsArray = [], reviewID) {
  return Promise.all(
    charsArray.map(idValPair => {
      return Characteristic_Reviews.create({
        characteristic_id: idValPair[0],
        value: idValPair[1]
      }).catch(err => {
        logError(
          `Error trying to add characteristic_review. Review: ${reviewID}; Characteristic: ${idValPair[0]}; Value: ${idValPair[1]}`,
          "postNewReviewErrors.txt"
        );
      });
    })
  );
}

function addPhotosToDB(photos = [], reviewID) {
  return Promise.all(
    photos.map(photoURL => {
      return Reviews_Photos.build({
        review_id: reviewID,
        image_url: photoURL
      })
        .save()
        .catch(err => {
          logError(
            `Error trying to add photo. Review: ${reviewID}; Photo: ${photoURL}`,
            "postNewReviewErrors.txt"
          );
        });
    })
  );
}
