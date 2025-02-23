import { sql } from "kysely";
import db from "../../config/db";
import { $time } from "../../shared/lib/get_time";
import uid from "../../shared/lib/uid";
import type { CreatePost } from "./dto/post.dto";
import ENV from "../../environment";
const url_prefix = `${ENV.SUPABASE_STORAGE_URL}/object/public/${ENV.STORAGE_BUCKET_NAME}/`;

export const createPost = async (body: CreatePost, user: string) => {
    const data = await db.transaction().execute(async (trx) => {
        const post = await trx
            .insertInto("posts")
            .values({
                id: uid("POST"),
                author: user,
                content: body.content,
                keywords: "",
                ts: $time(),
            })
            .returningAll()
            .executeTakeFirstOrThrow();
        const files = [];

        if (body.files) {
            const result = await trx
                .with("inserted", (cb) =>
                    cb
                        .insertInto("attachments_reference")
                        .values(
                            body.files!.map((id) => ({
                                id: uid("ATTACHMENT_REFERENCE"),
                                attachment_id: id,
                                post_id: post.id,
                            }))
                        )
                        .returningAll()
                )
                .selectFrom("attachments")
                .where("attachments.id", "=", sql<string>`ANY(${body.files!}::TEXT[])`)
                .select((cb) => [
                    cb
                        .fn("CONCAT", [
                            sql<string>`${url_prefix}::TEXT`,
                            "attachments.path",
                        ])
                        .as("url"),
                    "attachments.id",
                    "attachments.mimetype",
                ])
                .execute();

            files.push(...result);
        }

        return {
            ...post,
            files: files,
        };
    });

    return data;
};
