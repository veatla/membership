import type { Kysely } from "kysely";
import type { Database } from "../../../shared/types/database";
import { createIndex } from "../../../shared/lib/kysely";
import type { PostsTable } from "../../post/schema/post.schema";
import type { UsersTable } from "../../user/schema/user.schema";

export interface AttachmentsTable {
    id: string;

    /**
     * File path
     * By default it's `id`
     */
    path: string;

    /**
     * The authors id
     */
    user_id: UsersTable['id'];

    /**
     * File mimetype
     * By default it's `id`
     */
    mimetype: string;

    /**
     * File name
     */
    filename: string;
}

export interface AttachmentsReferenceTable {
    id: string;

    /**
     * Post id
     */
    post_id: PostsTable["id"];

    /**
     * Post id
     */
    attachment_id: AttachmentsTable["id"];
}

export const attachmentTable = {
    up: async (db: Kysely<Database>) => {
        await db.schema
            .createTable("attachments")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("user_id", "text", (cb) =>
                cb.references("users.id").notNull()
            )
            .addColumn("path", "text", (cb) => cb.notNull())
            .addColumn("mimetype", "text", (cb) => cb.notNull())
            .addColumn("filename", "text")
            .execute();

        await createIndex({
            db,
            table: "attachments",
            indexes: [
                {
                    using: "btree",
                    cols: ["mimetype", "filename"], 
                },
                {
                    using: "btree",
                    cols: ["filename"], 
                }
            ],
        });

        await db.schema
            .createTable("attachments_reference")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("attachment_id", "text", (cb) =>
                cb.references("attachments.id").notNull()
            )
            .addColumn("post_id", "text", (cb) =>
                cb.references("posts.id").notNull()
            )
            .execute();

        await createIndex({
            db,
            table: "attachments_reference",
            indexes: [
                {
                    using: "btree",
                    cols: ["attachment_id", "post_id"], 
                },
                {
                    using: "btree",
                    cols: ["post_id"], 
                }
            ],
        });
    },
    down: async (db: Kysely<Database>) => {
        await db.schema.dropTable("attachments").cascade().execute();
        await db.schema.dropTable("attachments_reference").cascade().execute();
    },
};
