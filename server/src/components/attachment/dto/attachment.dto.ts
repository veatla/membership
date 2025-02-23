import { Type, type Static } from "@sinclair/typebox";

export const BaseAttachmentSchema = {
    id: Type.String({
        title: "Attachment id",
        maxLength: 34,
    }),

    first_name: Type.String({
        title: "First Name",
        maxLength: 32,
    }),

    path: Type.String({
        title: "File path",
        maxLength: 32,
    }),

    mimetype: Type.String({
        title: "Mimetype",
        maxLength: 32,
    }),

    filename: Type.String({
        title: "Filename",
        maxLength: 32,
    }),
};
