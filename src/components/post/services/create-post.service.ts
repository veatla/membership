import db from "../../../config/db";
import uid from "../../../shared/lib/uid";

import { sql } from "kysely";
import { $time } from "../../../shared/lib/get_time";
import { type CreatePost } from "../dto/post.dto";
import { throw_err } from "../../../shared/lib/error";
import { create_upload_file_worker } from "../../attachment/workers/upload";
import { STORAGE_URL_PREFIX } from "../../../constants/storage";
import { getUserProductId } from "../../user/services/get-user-product-id.service";
import { create_post_access } from "./create_post_access.service";

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

        const data = {
            ...body.access,
            post_id: post.id,
        };

        await create_post_access(data, trx);

        return { ...post, files: files };
    });

    return data;
};
