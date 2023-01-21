const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();
const connection = mysql.createConnection({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
});

module.exports = { connection };
