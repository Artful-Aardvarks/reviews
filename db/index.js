const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = require("../config");
const Sequelize = require("sequelize");
const createSchema = require("./schema.js");
const characteristicsMethods = require("./characteristics");
// const productsETL = require("./etl/products.js");

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
	host: DB_HOST,
	dialect: "mysql"
});

const models = createSchema(sequelize);

module.exports = { sequelize, ...models };
