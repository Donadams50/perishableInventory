import path from "path";
import dotenv from "dotenv";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });


interface ENV {

  database: string | undefined;
  host: string | undefined;
  user: string | undefined;
  password: string | undefined;
  waitForConnections: string | undefined;
  connectionLimit: string | undefined;
  queueLimit: string | undefined;
  dialect: string | undefined;
  max: string | undefined;
  min: string | undefined;
  acquire: string | undefined;
  idle: string | undefined;
  
}

interface Config {

  database: string;
  host: string;
  user: string;
  password: string;
  waitForConnections: string;
  connectionLimit: string;
  queueLimit: string;
  dialect: string;
  max: string; 
  min: string;
  acquire: string;
  idle: string; 
} 

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    database: process.env.database,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    waitForConnections: process.env.waitForConnections,
    connectionLimit: process.env.connectionLimit,
    queueLimit: process.env.queueLimit,
    dialect: process.env.dialect,
    max: process.env.max,
    min: process.env.min,
    acquire: process.env.acquire,
    idle: process.env.idle,
  };
};


const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
