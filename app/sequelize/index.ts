import dotenv from "dotenv";
dotenv.config();

import config from "../../config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  {
    host: config.host,
    dialect: "mysql",
    operatorsAliases: false || undefined,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

sequelize.authenticate();
