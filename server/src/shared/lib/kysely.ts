import type { IndexType, Kysely } from "kysely";
import type { Database } from "../types/database";
import { pool } from "../../config/db";

export const createIndex = async <Key extends keyof Database>(params: {
    db: Kysely<Database>;
    table: Key;
    indexes: Array<{
        cols: Array<keyof Database[Key]>;
        using: IndexType;
        unique?: boolean;
    }>;
}) => {
    const { db, indexes, table } = params;
    for await (const { cols, using, unique = false } of indexes) {
        const request = db.schema
            .createIndex(`${table}_${cols.join("_")}_index`)
            .ifNotExists()
            .on(table)
            .columns(cols.map((v) => String(v)))
            .using(using);
        if (unique) await request.unique().execute();
        else await request.execute();
    }
};

export const init_postgres_fn = async () => {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    // Function to check bitwise
    await pool.query(
        `CREATE OR REPLACE FUNCTION CHECK_RIGHTS(flags int, bit_no int) RETURNS boolean as $$
            BEGIN
            return (flags >> bit_no) & 1 = 1;     
            END;
            $$ LANGUAGE plpgsql;`
    );

    // // Function to check bitwise
    await pool.query(
        `CREATE OR REPLACE FUNCTION CHECK_RIGHTS(flags int, bit_no int) RETURNS boolean as $$
            BEGIN
            return (flags >> bit_no) & 1 = 1;     
            END;
            $$ LANGUAGE plpgsql;`
    );

    // Function to set flag
    await pool.query(
        `
        CREATE OR REPLACE FUNCTION SET_RIGHTS(flags int, switch int, value boolean) RETURNS smallint as $$
            BEGIN IF (((flags >> switch) & 1 = 1) = value)
            THEN
            return flags;
            END IF;IF (value)
            THEN
            return flags + 2^switch;
            ELSE
            return flags - 2^switch;
            END IF;END;
            $$ LANGUAGE plpgsql;
        `
    );
};
