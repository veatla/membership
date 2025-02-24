import db from "../../../config/db";
import stripe from "../../../config/stripe";
import { throw_err } from "../../../shared/lib/error";
import { $time } from "../../../shared/lib/get_time";
import uid from "../../../shared/lib/uid";
import { create_upload_file_worker } from "../../attachment/workers/upload";
import { getUserProductId } from "../../user/lib/get-user-product-id";
import type { Profile } from "../../user/schema/user.schema";
import type { CreateMembership } from "../dto/membership.dto";

const upload_image = async (cover: Express.Multer.File | undefined, user_id: string) => {
    if (!cover) return null;

    const files_result = await create_upload_file_worker([cover], user_id);
    if (files_result.error[0]) throw_err(files_result.error[0]);

    return files_result.result[0].path;
};
export const createMembershipTiers = async (
    body: CreateMembership,
    cover: Express.Multer.File | undefined,
    author: Profile
) => {
    return db.transaction().execute(async (trx) => {
        const image = await upload_image(cover, author.id);

        const product_id = await getUserProductId(author, trx);

        const plan = await stripe.plans.create({
            currency: "USD",
            product: product_id,
            interval: "month",
            amount_decimal: body.price,
            active: true,
        });

        const membership = await trx
            .insertInto("membership_tiers")
            .values({
                id: uid("MEMBERSHIP_TIER"),
                author: author.id,
                description: body.description,
                name: body.name,
                stripe_plan_id: plan.id,
                ts: $time(),
                cover: image,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return membership;
    });
};

// await stripe.subscriptions.create({
//     customer: "",
//     items: [
//         {
//             plan: plan.id,
//         },
//     ],
// });
