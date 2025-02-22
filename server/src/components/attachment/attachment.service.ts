import { storageClient } from "../../config/storage";
import ENV from "../../environment";
import { throw_err } from "../../shared/lib/error";

type FileBody =
    | ArrayBuffer
    | ArrayBufferView
    | Blob
    | Buffer
    | File
    | FormData
    | NodeJS.ReadableStream
    | ReadableStream<Uint8Array>
    | URLSearchParams
    | string;

export const get_urls = async (path: Array<string>) => {
    const { data, error } = await storageClient
        .from(ENV.STORAGE_BUCKET_NAME)
        .createSignedUrls(path, 3600);

    if (error) {
        console.log(`Storage get file error ${path}`, error);
        // return error.message
        throw_err("File not found!", 404);
    }

    return data;
};

export const upload = async (path: string, file: FileBody) => {
    const { data, error } = await storageClient
        .from(ENV.STORAGE_BUCKET_NAME)
        .upload(path, file);
    if (error) {
        console.log(`Storage get file error ${path}`, error);
        // return error.message
        throw_err("File not found!", 404);
    }
    return data.path;
};
