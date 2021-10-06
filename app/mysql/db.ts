import mysql from "mysql2";
import * as dotenv from "dotenv";
import config from "../../config";
dotenv.config();

export const db = mysql.createConnection({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 1,
});

const connection = db;

module.exports = connection;
