// this file is JS because worker threads doesn't friendly with .ts files
// And it's being used there
// "ts-node".register() adds extra 1-2 seconds, that I don't like.

import { isMainThread, parentPort, workerData, Worker } from "worker_threads";
import APIError from "../../../shared/lib/error";
import { storageClient } from "../../../config/storage";
import db from "../../../config/db";
import { fileURLToPath } from "url";
import uid from "../../../shared/lib/uid";
import path from "path";

const __filename = fileURLToPath(import.meta.url);

/**
 * @param {{
 *     files: Array<Express.Multer.File>;
 *     user: string
 * }} files
 * @returns {import("../types/worker").WorkerUploadResponse}
 */
const upload_file = async ({ files, user }) => {
    const error = [];
    const result = [];

    for await (const file of files) {
        const extension = path.extname(file.originalname);
        const filename = `${uid("ATTACHMENT_ITEM")}${extension}`;
        const file_path = `${file.mimetype}/${filename}`;
        try {
            const response = await storageClient.from("attachments").upload(file_path, file.buffer);

            if (response.error) {
                error.push(response.error.message);
                continue;
            }

            const file_result = await db
                .insertInto("attachments")
                .values({
                    id: uid("ATTACHMENT"),
                    filename: file.originalname,
                    mimetype: file.mimetype,
                    path: response.data.path,
                    user_id: user,
                })
                .returningAll()
                .executeTakeFirstOrThrow();

            result.push(file_result);
        } catch (err) {
            error.push(err.message ?? JSON.stringify(err));
        }
    }

    return { error, result };
};

/**
 * @param {Array<Express.Multer.File>} files
 * @param {string} user - user id
 * @returns {Promise<import("../types/worker").WorkerUploadResponse>}
 */
export function create_upload_file_worker(files, user) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
            workerData: { files, user },
        });

        worker.on(
            "message",
            /**
             * @param {import("../types/worker").WorkerUploadResponse} result
             */
            (result) => {
                resolve(result);
                worker.terminate();
            }
        );
        worker.on("error", reject);
        worker.on("exit", (code) => {
            if (code !== 0) reject(new APIError(`Worker stopped with exit code ${code}`, 500));
        });
    });
}

// If this main thread do nothing
if (!isMainThread) {
    upload_file(workerData)
        .then((res) => {
            // emit event to parent thread
            parentPort.postMessage(res);
        })
}
