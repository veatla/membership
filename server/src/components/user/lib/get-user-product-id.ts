import type { Transaction } from "kysely";
import type { Database } from "../../../shared/types/database";
import type { Profile } from "../schema/user.schema";
import { throw_err } from "../../../shared/lib/error";
import stripe from "../../../config/stripe";

export const getUserProductId = async (profile: string | Profile, trx: Transaction<Database>) => {
    let user;
    if (typeof profile === "string") {
        user = await trx.selectFrom("users").where("id", "=", profile).selectAll().executeTakeFirst();
    } else user = profile;

    if (!user) throw_err("Unable to find user", 500);

    if (user.stripe_product_id) return user.stripe_product_id;

    const product = await stripe.products.create({
        name: user.username!,
        description: user.display_name ?? undefined,
        active: true,
    });

    await trx
        .updateTable("users")
        .set({
            stripe_product_id: product.id,
        })
        .where("id", "=", user.id)
        .execute();

    return product.id;
};
