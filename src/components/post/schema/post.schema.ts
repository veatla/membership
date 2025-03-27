import type { Kysely } from "kysely";
import type { Database } from "../../../shared/types/database";
import { createIndex } from "../../../shared/lib/kysely";
import type { UsersTable } from "../../user/schema/user.schema";
import type { PostType } from "../dto/post.dto";

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

    type: PostType;

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
            .addColumn("type", "text")
            .addColumn("subscription", "text", (cb) => cb.references("membership_tiers.id"))
            .addColumn("post_id", "text", (cb) => cb.references("posts.id"))
            .addUniqueConstraint("post_id_subscription_type_unique", ["post_id", "subscription", "type"])
            .execute();
    },

    down: async (db: Kysely<Database>) => {
        await db.schema.dropTable("post_accesses").ifExists().cascade().execute();
    },
};
