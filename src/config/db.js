// this file is JS because worker threads doesn't friendly with .ts files
// And it's being used there 

import { Pool } from "pg";
import ENV from "../environment";
import { Kysely, PostgresDialect } from "kysely";

export const pool = new Pool({
    host: ENV.PG_HOST,
    port: ENV.PG_PORT,
    password: ENV.PG_PASSWORD,
    database: ENV.PG_DATABASE,
    user: ENV.PG_USER,
});

const dialect = new PostgresDialect({
    pool: pool,
});

/** @type {Kysely<import("../shared/types/database").Database>} */
const db = new Kysely({
    dialect: dialect,
    log(event) {
        if (event.level === 'error') {
          console.log(event.query.sql)
          console.log(event.query.parameters)
        }
      }
});

export default db;
