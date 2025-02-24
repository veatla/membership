import { Type, type Static } from "@sinclair/typebox";
export enum PostType {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}
export const BasePostSchema = {
    id: Type.String({
        title: "Post id",
        maxLength: 34,
    }),

    content: Type.String({
        title: "Content",
        maxLength: 1000,
    }),

    type: Type.Enum(PostType, {
        title: "Content",
        maxLength: 1000,
    }),

    available: Type.Union([
        Type.Object({
            type: Type.Literal("SUBSCRIPTION"),
            id: Type.String({
                title: "Subscription id",
                maxLength: 1000,
            }),
        }),
        Type.Object({
            type: Type.Literal("USER"),
            id: Type.String({
                title: "User id",
                maxLength: 1000,
            }),
        }),
    ]),
};

export const CreatePostSchema = Type.Object({
    content: BasePostSchema.content,
    files: Type.Optional(Type.Array(Type.String())),
    type: Type.Optional(BasePostSchema.type),
    available: Type.Optional(Type.Array(BasePostSchema.available)),
});
export type CreatePost = Static<typeof CreatePostSchema>;
