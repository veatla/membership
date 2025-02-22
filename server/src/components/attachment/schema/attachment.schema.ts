import type { Kysely } from "kysely";
import type { Database } from "../../../shared/types/database";
import { createIndex } from "../../../shared/lib/kysely";

export interface AttachmentsTable {
    id: string;

    /**
     * Users username
     * By default it's `id`
     */
    user_id: string;

    /**
     * File path
     * By default it's `id`
     */
    path: string;

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

export const AttachmentTable = {
    up: async (db: Kysely<Database>) => {
        await db.schema
            .createTable("attachments")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("user_id", "text")
            .addColumn("path", "text", (cb) => cb.unique())
            .addColumn("mimetype", "text", (cb) => cb.unique().notNull())
            .addColumn("birthday", "integer")
            .execute();

        await createIndex({
            db,
            table: "attachments",
            indexes: [
                {
                    using: "btree",
                    cols: ["", "email", "phone"],
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
        await db.schema.dropTable("attachments").cascade().execute();
    },
};
