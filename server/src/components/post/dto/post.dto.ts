import { Type, type Static } from "@sinclair/typebox";

export const BasePostSchema = {
    id: Type.String({
        title: "Post id",
        maxLength: 34,
    }),

    content: Type.String({
        title: "Content",
        maxLength: 1000,
    }),
};


export const CreatePostSchema = Type.Object({
    content: BasePostSchema.content,
    files: Type.Optional(Type.Array(Type.String())),
});
export type CreatePost = Static<typeof CreatePostSchema>;
