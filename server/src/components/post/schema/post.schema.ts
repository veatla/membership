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

export interface PostAccesses {
    id: number;

    /**
     * User id - that have access to this post
     */
    user_id: string;

    post_id: string;
}

export const postsTable = {
    up: async (db: Kysely<Database>) => {
        await db.schema
            .createTable("posts")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("content", "text", (cb) => cb.defaultTo("''"))
            .addColumn("author", "text", (cb) => cb.unique())
            .addColumn("keywords", "text")
            .addColumn("ts", "integer", (cb) => cb.notNull())
            .execute();

        await createIndex({
            db,
            table: "posts",
            indexes: [
                {
                    using: "btree",
                    cols: ["keywords", "content", "author", "ts"],
                },
                {
                    using: "btree",
                    cols: ["content", "author", "ts"],
                },
                {
                    using: "btree",
                    cols: ["content", "author"],
                },
                {
                    using: "btree",
                    cols: ["content", "keywords"],
                },
                {
                    using: "btree",
                    cols: ["keywords", "ts", "content"],
                },
                {
                    using: "btree",
                    cols: ["keywords", "ts"],
                },
                {
                    using: "btree",
                    cols: ["ts"],
                },
            ],
        });

        await db.schema
            .createTable("post_accesses")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("user_id", "text", (cb) => cb.references("users.id"))
            .addColumn("post_id", "text", (cb) => cb.references("posts.id"))
            .execute();
            
        await createIndex({
            db,
            table: "post_accesses",
            indexes: [
                {
                    using: "btree",
                    cols: ["post_id", "user_id"],
                },
                {
                    using: "btree",
                    cols: ["post_id"],
                },
                {
                    using: "btree",
                    cols: ["user_id"],
                },
            ],
        });

    },
    down: async (db: Kysely<Database>) => {
        await db.schema.dropTable("posts").cascade().execute();
    },
};
