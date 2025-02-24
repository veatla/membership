import stripe from "../../../config/stripe";
import { throw_err } from "../../../shared/lib/error";
import type { UsersTable } from "../schema/user.schema";

export const createStripeCustomer = async (user: UsersTable) => {
    const customer = await stripe.customers
        .create({
            email: user.email,
            description: user.username ?? undefined,
        })
        .catch(() => {
            // TODO Need to provide logger
            throw_err("Something went wrong! Please try again!");
        });

    return customer;
};
