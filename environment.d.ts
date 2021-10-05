declare global {
  namespace NodeJS {
    interface ProcessEnv {
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
  }
}

export {};
