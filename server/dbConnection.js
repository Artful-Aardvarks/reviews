const Sequelize = require("sequelize");
const createSchema = require("./schema.js");
const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = require("../config");

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql"
  // logging: false
});

const models = createSchema(sequelize, /*createTables = */ true);

module.exports = { ...models, sequelize };
