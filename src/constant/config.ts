import "dotenv/config";

const config = {
  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_HOST: process.env.DB_HOST || "localhost",
  ORIGIN: process.env.ORIGIN || "*",
  SECRET_KEY: process.env.SECRET_KEY || "1q@w3e4r5t6y",
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
};

export default config;
