import type { Kysely } from "kysely";
import type { Database } from "../../../shared/types/database";
import { createIndex } from "../../../shared/lib/kysely";
import type { UsersTable } from "../../user/schema/user.schema";
import type { AttachmentsTable } from "../../attachment/schema/attachment.schema";

export interface MembershipTierTable {
    id: string;

    /**
     * Stripe plan id that belongs to author
     * to take payments
     */
    stripe_plan_id: string;

    /**
     * MembershipTier name that user can provide
     */
    name: string;

    /**
     * Cover image url path
     */
    cover: AttachmentsTable["path"] | null;

    /**
     * MembershipTier description to describe for what user is subscribing
     */
    description: string;

    /**
     * Authors id
     */
    author: UsersTable["id"];

    /**
     * Timestamp. When this data was created
     * @returns `new Date().getTime() / 1000`
     */
    ts: number;
}

export interface MemberSubscriptionsTable {
    /**
     * Membership tier id
     */
    member_id: string;

    /**
     * Member's subscription id in stripe tier id
     */
    stripe_subscription_id: string;

    /**
     * Users id subscribed to the author
     */
    user_id: string;

    /**
     * Authors id who created this membership
     */
    author_id: string;

    /**
     * Timestamp. When this data was created
     * @returns `new Date().getTime() / 1000`
     */
    ts: number;
}

export const membershipTierTable = {
    up: async (db: Kysely<Database>) => {
        await db.schema
            .createTable("membership_tiers")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("stripe_subscription_id", "text", (cb) => cb.unique().notNull())
            .addColumn("name", "text", (cb) => cb.notNull())
            .addColumn("description", "text", (cb) => cb.notNull())
            .addColumn("author", "text", (cb) => cb.references("users.id"))
            .addColumn("cover", "text", (cb) => cb.references("attachments.path").onDelete("cascade"))
            .addColumn("ts", "integer", (cb) => cb.notNull())
            .execute();

        await createIndex({
            db,
            table: "membership_tiers",
            indexes: [
                { cols: ["author"], using: "btree" },
                { cols: ["name"], using: "btree" },
            ],
        });

        await db.schema
            .createTable("member_subscriptions")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("member_id", "text", (cb) => cb.unique().notNull())
            .addColumn("stripe_subscription_id", "text", (cb) => cb.notNull())
            .addColumn("user_id", "text", (cb) => cb.references("users.id").notNull())
            .addColumn("author_id", "text", (cb) => cb.references("users.id").notNull())
            .addColumn("ts", "integer", (cb) => cb.notNull())
            .execute();

        await createIndex({
            db,
            table: "member_subscriptions",
            indexes: [
                { cols: ["author_id"], using: "btree" },
                { cols: ["member_id"], using: "btree" },
                { cols: ["author_id", "user_id"], using: "btree" },
            ],
        });
    },
    down: async (db: Kysely<Database>) => {
        await db.schema.dropTable("membership_tiers").ifExists().cascade().execute();
        await db.schema.dropTable("member_subscriptions").ifExists().cascade().execute();
    },
};

export const memberSubscriptionsTable = {
    up: async (db: Kysely<Database>) => {
        await db.schema
            .createTable("member_subscriptions")
            .ifNotExists()
            .addColumn("id", "text", (cb) => cb.primaryKey().notNull())
            .addColumn("member_id", "text", (cb) => cb.unique().notNull())
            .addColumn("stripe_subscription_id", "text", (cb) => cb.notNull())
            .addColumn("user_id", "text", (cb) => cb.references("users.id").notNull())
            .addColumn("author_id", "text", (cb) => cb.references("users.id").notNull())
            .addColumn("ts", "integer", (cb) => cb.notNull())
            .execute()

        await createIndex({
            db,
            table: "member_subscriptions",
            indexes: [
                { cols: ["author_id"], using: "btree" },
                { cols: ["member_id"], using: "btree" },
                { cols: ["author_id", "user_id"], using: "btree" },
            ],
        });
    },
    down: async (db: Kysely<Database>) => {
        await db.schema.dropTable("member_subscriptions").ifExists().cascade().execute();
    },
};
