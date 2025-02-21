import type { Kysely } from "kysely";
import type { Database } from "../../../shared/types/database";
import { createIndex } from "../../../shared/lib/kysely";

export interface UsersTable {
    id: string;

    /**
     * Users username
     * By default it's `id`
     * GET /user/:username
     * GET /user/:id
     */
    username: string | null;

    /** Users password. Hashed with crypto */
    password: string;

    /** Users display name */
    display_name: string | null;

    /**
     * For User Verification & For Recover account
     */
    email: string;

    /**
     * For Security & For Recover account
     */
    phone: string | null;

    /**
     * Required for NSFW contents
     */
    birthday: number | null;
}

export const usersTable = {
    up: async (db: Kysely<Database>) => {
        await db.schema
            .createTable("users")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("display_name", "text")
            .addColumn("username", "text", (cb) => cb.unique())
            .addColumn("email", "text", (cb) => cb.unique().notNull())
            .addColumn("phone", "text", (cb) => cb.unique())
            .addColumn("birthday", "integer")
            .execute();

        await createIndex({
            db,
            table: "users",
            indexes: [
                {
                    using: "btree",
                    cols: ["username", "email", "phone"],
                },
                {
                    using: "btree",
                    cols: ["username", "display_name"],
                },
                {
                    using: "btree",
                    cols: ["username"],
                },
                {
                    using: "btree",
                    cols: ["email"],
                },
            ],
        });
    },
    down: async (db: Kysely<Database>) => {
        await db.schema.dropTable("users").cascade().execute();
    },
};
