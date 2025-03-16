import db from "../../../config/db";

export const getUsersMembershipSubscriptions = async (user: string) => {
    const result = await db
        .selectFrom("member_subscriptions as ms")
        .where("ms.user_id", "=", user)
        .selectAll()
        .innerJoin("membership_tiers as mt", "ms.author_id", "mt.author")
        .execute();

    return result;
};
