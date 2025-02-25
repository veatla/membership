import db from "../../../config/db";
import stripe from "../../../config/stripe";
import { throw_err } from "../../../shared/lib/error";
import { $time } from "../../../shared/lib/get_time";
import uid from "../../../shared/lib/uid";
import { getStripeCustomer } from "../../user/services/create-stripe-customer.service";
import type { Profile } from "../../user/schema/user.schema";

export const subscribeToAuthor = async (membership_id: string, profile: Profile) => {
    const membership = await db
        .selectFrom("membership_tiers")
        .selectAll()
        .where("id", "=", membership_id)
        .executeTakeFirst();

    if (!membership) throw_err("Membership not found!", 404);

    const customer = await getStripeCustomer(profile);

    const subscription = await stripe.subscriptions.create({
        customer: customer,
        items: [
            {
                plan: membership.stripe_plan_id,
            },
        ],
    });

    const inserted = await db
        .insertInto("member_subscriptions")
        .values({
            author_id: membership.author,
            id: uid("SUBSCRIPTION"),
            membership_tier_id: membership_id,
            stripe_subscription_id: subscription.id,
            ts: $time(),
            user_id: profile.id,
        })
        .returningAll()
        .executeTakeFirst();

    return inserted;
};
