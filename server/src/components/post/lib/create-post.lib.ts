import { sql } from "kysely";
import db from "../../../config/db";
import { $time } from "../../../shared/lib/get_time";
import uid from "../../../shared/lib/uid";
import { PostType, type CreatePost } from "../dto/post.dto";
import { throw_err } from "../../../shared/lib/error";
import { create_upload_file_worker } from "../../attachment/workers/upload";
import { STORAGE_URL_PREFIX } from "../../../constants/storage";
import { getUserProductId } from "../../user/lib/get-user-product-id";
import type { PostAccessesTable } from "../schema/post.schema";
export const create_post = async (body: CreatePost, user_id: string, inputFiles?: Array<Express.Multer.File>) => {
    const files: Array<string> = [];

    if (inputFiles?.length) {
        if (!Array.isArray(inputFiles)) throw_err("Something unexpected happened");
        const files_result = await create_upload_file_worker(inputFiles, user_id);
        files.push(...files_result.result.map((v) => v.id));
    }

    const data = await db.transaction().execute(async (trx) => {
        await getUserProductId(user_id, trx);

        const post = await trx
            .insertInto("posts")
            .values({
                id: uid("POST"),
                author: user_id,
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
                    cb.fn("CONCAT", [sql<string>`${STORAGE_URL_PREFIX}::TEXT`, "attachments.path"]).as("url"),
                    "attachments.id",
                    "attachments.mimetype",
                ])
                .execute();

            files.push(...result);
        }

        if (body.memberships?.length || body.users?.lastIndexOf) {
            const prepared: Array<PostAccessesTable> = [];
            body.memberships?.split(/\s*\,\s*/).forEach((id) => {
                // If type subscription then this post available to only this members
                const data = <PostAccessesTable>{
                    id: uid("POST_ACCESSES"),
                    post_id: post.id,
                    type: "PRIVATE",
                    subscription: id,
                };
                prepared.push(data);
            });

            body.users?.split(/\s*\,\s*/).forEach((id) => {
                // otherwise then this post available to only this member
                const data = <PostAccessesTable>{
                    id: uid("POST_ACCESSES"),
                    post_id: post.id,
                    type: "PRIVATE",
                    user_id: id,
                };
                prepared.push(data);
            });
            if (prepared.length) await trx.insertInto("post_accesses").values(prepared).execute();
        } else {
            const post_access_id = uid("POST_ACCESSES");
            await trx
                .insertInto("post_accesses")
                .values({
                    id: post_access_id,
                    post_id: post.id,
                    type: "PUBLIC",
                })
                .execute();
        }

        return {
            ...post,
            files: files,
        };
    });

    return data;
};
