import dotenv from "dotenv";
dotenv.config();
const config = {
  SYSTEM_DB_HOST: "localhost",
  SYSTEM_DB_PORT: 5432,
  SYSTEM_DB_USER: process.env.SYSTEM_DB_USER,
  SYSTEM_DB_PWD: process.env.SYSTEM_DB_PWD,
  SYSTEM_DB_NAME: process.env.SYSTEM_DB_NAME,
  SECRET_KEY: process.env.SECRET_KEY || "1q@w3e4r5t6y",
};

export default config;
