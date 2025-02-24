import stripe from "../../../config/stripe";
import { throw_err } from "../../../shared/lib/error";
import type { Profile, UsersTable } from "../schema/user.schema";

export const getStripeCustomer = async (user: Profile) => {
    if (user.stripe_customer_id) return user.stripe_customer_id;

    const customer = await stripe.customers
        .create({
            email: user.email,
            description: user.username ?? undefined,
            balance: process.env.NODE_ENV === "development" ? 99999999 : 0,
        })
        .catch(() => {
            // TODO Need to provide logger
            throw_err("Something went wrong! Please try again!");
        });

    return customer.id;
};
