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

    subscription_id: Type.String({
        title: "Subscription ids",
        maxLength: 1000,
    }),

    user_id: Type.String({
        title: "User id",
        maxLength: 1000,
    }),
};

export const CreatePostSchema = Type.Object({
    content: BasePostSchema.content,
    files: Type.Optional(Type.Array(Type.String())),
    type: Type.Optional(BasePostSchema.type),
    memberships: Type.Optional(BasePostSchema.subscription_id),
    users: Type.Optional(BasePostSchema.user_id),
});
export type CreatePost = Static<typeof CreatePostSchema>;
