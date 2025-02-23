export interface WorkerUploadResponse {
    error: string[]
    result: {
        id: string;
        path: string;
        mimetype: string;
        filename: string;
    }[]
}