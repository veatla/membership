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
                    cb.fn("CONCAT", [sql<string>`${url_prefix}::TEXT`, "attachments.path"]).as("url"),
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

export const getUserPosts = async (author: string, profile: string) => {
    const is_me = author === profile;

    return await db.transaction().execute(async (trx) => {
        return trx
            .selectFrom("posts as p")
            .selectAll("p")
            .$if(!is_me, (cb) =>
                cb.innerJoin("post_accesses as pa", (qb) =>
                    qb
                        // Check for user id === requesting user id
                        .on("pa.user_id", "=", profile)
                        // Check access for exactly this post
                        .onRef("pa.post_id", "=", "p.id")
                )
            )
            .innerJoinLateral(
                (cb) =>
                    cb
                        .selectFrom("attachments_reference as ar")
                        .whereRef("ar.post_id", "=", "p.id")
                        .innerJoin("attachments", "attachments.id", "ar.attachment_id")
                        .selectAll("attachments")
                        .as("attaches"),
                (cb) => cb.onTrue()
            )
            .selectAll("p")
            .groupBy(["p.id"])
            .select((cb) => cb.fn.jsonAgg("attaches").filterWhere("attaches.id", "is not", null).as("attachments"))
            .execute();
    });
};
