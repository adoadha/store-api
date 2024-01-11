import config from "../config";

import pgPromise from "pg-promise";

const pgp = pgPromise();

const db = pgp({
  port: config.SYSTEM_DB_PORT,
  host: config.SYSTEM_DB_HOST,
  database: config.SYSTEM_DB_NAME,
  user: config.SYSTEM_DB_USER,
  password: config.SYSTEM_DB_PWD,
});

export default db;
