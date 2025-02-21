export interface Post {
    id: string;
    author: string;

    content: string;
    ts: number;

    attachments: string[];
}
