import db from "../../../config/db";

export const getAuthorMembershipTiers = async (author: string, user?: string) => {
    return await db
        .selectFrom("membership_tiers as mt")
        .selectAll("mt")
        .$if(!!user && author !== user, (cb) =>
            cb.select((cb) =>
                cb
                    .exists(
                        cb
                            .selectFrom("member_subscriptions as ms")
                            .where((wh) => wh.and([wh("ms.author_id", "=", author), wh("ms.user_id", "=", author)]))
                    )
                    .as("subscribed")
            )
        )
        .execute();
};
