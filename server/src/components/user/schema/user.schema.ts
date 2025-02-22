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
    
    /**
     * Stripe Customer id for payments & subscriptions
     */
    stripe_customer_id: string | null;

    /**
     * Users state
     * ```
     * const state = UserState.PUBLIC | UserState.VERIFIED;
     * const is_public = state & UserState.PUBLIC;
     * ```
     */
    state: number;
}

export interface UsersRelationships {
    id: number;
    user_id: string;
    related_id: string;
    /**
     * ```
     * const state = UserAccess.PUBLIC | UserAccess.VERIFIED;
     * const is_public = state & UserAccess.PUBLIC;
     * ```
     */
    state: number;
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
            .addColumn("stripe_customer_id", "text", (cb) => cb.unique())
            .addColumn("state", "smallint", (cb) => cb.notNull())
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

        await db.schema
            .createTable("user_relationships")
            .ifNotExists()
            .addColumn("id", "serial", (cb) => cb.primaryKey())
            .addColumn("user_id", "text", (cb) =>
                cb.unique().references("users.is")
            )
            .addColumn("related_id", "text", (cb) =>
                cb.unique().references("users.is")
            )
            .addColumn("state", "smallint", (cb) => cb.notNull())
            .execute();

        await createIndex({
            db,
            table: "user_relationships",
            indexes: [
                {
                    using: "btree",
                    cols: ["state", "related_id", "user_id"],
                },
                {
                    using: "btree",
                    cols: ["user_id", "related_id"],
                },
            ],
        });
    },
    down: async (db: Kysely<Database>) => {
        await db.schema.dropTable("user_relationships").cascade().execute();
        await db.schema.dropTable("users").cascade().execute();
    },
};
