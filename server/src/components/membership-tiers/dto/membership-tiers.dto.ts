import { Type, type Static } from "@sinclair/typebox";

export const BaseMembershipTiersSchema = {
    id: Type.String({
        title: "Post id",
        maxLength: 34,
    }),

    name: Type.String({
        title: "Membership tier name",
        maxLength: 34,
    }),

    price: Type.String({
        title: "Membership tier price",
    }),

    description: Type.String({
        title: "Membership tier description",
        maxLength: 34,
    }),

    free_tier: Type.Boolean({
        title: "Membership tier free tier",
        maxLength: 34,
    }),
};

export const CreateMembershipTierSchema = Type.Object({
    id: BaseMembershipTiersSchema.id,
    name: BaseMembershipTiersSchema.name,
    price: BaseMembershipTiersSchema.price,
    description: BaseMembershipTiersSchema.description,
    free_tier: Type.Optional(BaseMembershipTiersSchema.free_tier),
});

export type CreateMembership = Static<typeof CreateMembershipTierSchema>;
