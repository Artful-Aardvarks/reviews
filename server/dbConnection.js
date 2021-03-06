const Sequelize = require("sequelize");
const createSchema = require("./schema.js");
const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
} = require("./config");

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  port: DB_PORT
  // logging: false
});

const models = createSchema(sequelize, /*createTables = */ false);

module.exports = { ...models, sequelize };
