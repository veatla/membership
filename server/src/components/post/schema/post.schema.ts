import type { Kysely } from "kysely";
import type { Database } from "../../../shared/types/database";
import { createIndex } from "../../../shared/lib/kysely";
import type { UsersTable } from "../../user/schema/user.schema";

export interface PostsTable {
    id: string;

    /**
     * Posts text content
     */
    content: string;

    /**
     * Users username
     * `user['id']`
     */
    author: UsersTable["id"];

    /**
     * Posts keyword text
     */
    keywords: string;

    /**
     * Timestamp. When this post was created
     * @returns `new Date().getTime() / 1000`
     */
    ts: number;
}

export interface PostAccessesTable {
    id: string;

    /**
     * User id - that have access to this post
     */
    user_id: string | null;

    type: "PRIVATE" | "PUBLIC";

    subscription: string | null;

    post_id: string;
}

export const postsTable = {
    up: async (db: Kysely<Database>) => {
        await db.schema
            .createTable("posts")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("content", "text", (cb) => cb.defaultTo("''"))
            .addColumn("author", "text", (cb) => cb.references("users.id"))
            .addColumn("keywords", "text")
            .addColumn("ts", "integer", (cb) => cb.notNull())
            .execute();

        await createIndex({
            db,
            table: "posts",
            indexes: [
                // For searching by the keywords
                { cols: ["keywords", "ts"], using: "btree" },
                // For search content in some authors posts
                { cols: ["content", "author"], using: "btree" },
                // For sort by author & timestamp
                { cols: ["author", "ts"], using: "btree" },
            ],
        });
    },

    down: async (db: Kysely<Database>) => {
        await db.schema.dropTable("posts").ifExists().cascade().execute();
    },
};
export const postAccessesTable = {
    up: async (db: Kysely<Database>) => {
        await db.schema
            .createTable("post_accesses")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("user_id", "text", (cb) => cb.references("users.id"))
            .addColumn("type", "text")
            .addColumn("subscription", "text", (cb) => cb.references("member_subscriptions.id"))
            .addColumn("post_id", "text", (cb) => cb.references("posts.id"))
            .execute();

        await createIndex({
            db,
            table: "post_accesses",
            indexes: [
                // For selecting post by user access;
                {
                    using: "btree",
                    cols: ["post_id", "user_id", "subscription", "type"],
                },
            ],
        });
    },

    down: async (db: Kysely<Database>) => {
        await db.schema.dropTable("post_accesses").ifExists().cascade().execute();
    },
};
