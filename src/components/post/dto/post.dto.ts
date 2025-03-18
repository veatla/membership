import { Type, type Static } from "@sinclair/typebox";

export enum PostType {
    PUBLIC = "PUBLIC",
    ALL_MEMBERS = "ALL_MEMBERS",
    PAYED_MEMBERS_ONLY = "PAYED_MEMBERS_ONLY",
    FREE_MEMBERS_ONLY = "FREE_MEMBERS_ONLY",
    SELECTED_TIERS = "SELECTED_TIERS",
    PURCHASE_ONLY = "PURCHASE_ONLY",
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
        title: "Access Type",
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
    selling_price: Type.Number({
        title: "Selling price for content available to anyone",
    }),

    early_access: Type.Number({
        title: "Early access time for payed members",
    }),

    release_date: Type.Number({
        title: "Release time for payed members",
    }),

    preview: Type.String({
        title: "Content preview for non members",
    }),
};

const createPostTypes = Type.Union([
    Type.Object({
        type: Type.Literal(PostType.SELECTED_TIERS),
        memberships: Type.Optional(BasePostSchema.subscription_id),
        selling_price: Type.Optional(BasePostSchema.selling_price),
        early_access: BasePostSchema.early_access,
        preview: BasePostSchema.preview,
    }),

    Type.Object({
        type: Type.Literal(PostType.ALL_MEMBERS),
        preview: BasePostSchema.preview,
    }),

    Type.Object({
        type: Type.Literal(PostType.FREE_MEMBERS_ONLY),
    }),

    Type.Object({
        type: Type.Literal(PostType.PAYED_MEMBERS_ONLY),
        selling_price: BasePostSchema.selling_price,
        preview: BasePostSchema.preview,
    }),

    Type.Object({
        type: Type.Literal(PostType.PUBLIC),
    }),

    Type.Object({
        type: Type.Literal(PostType.PURCHASE_ONLY),
        selling_price: BasePostSchema.selling_price,
        preview: BasePostSchema.preview,
    }),
]);

export const CreatePostSchema = Type.Object({
    content: BasePostSchema.content,
    files: Type.Optional(Type.Array(Type.String())),
    type: BasePostSchema.type,
    users: Type.Optional(BasePostSchema.user_id),
    keywords: Type.Array(Type.String()),
    comments: Type.Boolean({ default: true }),
    notification: Type.Boolean({ default: true }),
    release_date: BasePostSchema.release_date,
    access: createPostTypes,
});

export type CreatePost = Static<typeof CreatePostSchema>;
