const Sequelize = require("sequelize");
require("dotenv").config();

// Set up a sequelize connection, if DB_URL does not exist
const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: "localhost",
        dialect: "postgres",
      },
    );

module.exports = sequelize;
