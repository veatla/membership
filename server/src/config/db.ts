import { Pool } from "pg";
import ENV from "../environment";
import { Kysely, PostgresDialect } from "kysely";
import type { Database } from "../shared/types/database";

const pool = new Pool({
    host: ENV.PG_HOST,
    port: ENV.PG_PORT,
    password: ENV.PG_PASSWORD,
    user: ENV.PG_USER,
});

const dialect = new PostgresDialect({
    pool: pool,
});

const db = new Kysely<Database>({
    dialect: dialect,
});

export default db;
