import type { Transaction } from "kysely";
import uid from "../../../shared/lib/uid";
import type { Database } from "../../../shared/types/database";
import { PostType, type PostAccess } from "../dto/post.dto";
import type { PostAccessesTable } from "../schema/post.schema";

export const create_post_access = async (body: PostAccess & { post_id: string }, trx: Transaction<Database>) => {
    const prepared: Array<PostAccessesTable> = [];
    switch (body.type) {
        case PostType.SELECTED_TIERS:
            body.memberships.split(/\s*\,\s*/).forEach((id) => {
                const data = <PostAccessesTable>{
                    id: uid("POST_ACCESSES"),
                    post_id: body.post_id,
                    type: body.type,
                    subscription: id,
                };

                prepared.push(data);
            });

            break;

        case PostType.PURCHASE_ONLY:
            const purchasable_data = <PostAccessesTable>{
                id: uid("POST_ACCESSES"),
                post_id: body.post_id,
                type: body.type,
            };

            prepared.push(purchasable_data);
            break;

        case PostType.PAYED_MEMBERS_ONLY:
            const payed_data = <PostAccessesTable>{
                id: uid("POST_ACCESSES"),
                post_id: body.post_id,
                type: body.type,
            };

            prepared.push(payed_data);
            break;

        case PostType.FREE_MEMBERS_ONLY:
            const free_data = <PostAccessesTable>{
                id: uid("POST_ACCESSES"),
                post_id: body.post_id,
                type: body.type,
            };

            prepared.push(free_data);
            break;

        case PostType.ALL_MEMBERS:
            const all_members_data = <PostAccessesTable>{
                id: uid("POST_ACCESSES"),
                post_id: body.post_id,
                type: body.type,
            };

            prepared.push(all_members_data);
            break;

        default:
            const public_data = <PostAccessesTable>{
                id: uid("POST_ACCESSES"),
                post_id: body.post_id,
                type: body.type,
            };
            prepared.push(public_data);
            break;
    }

    if (prepared.length) {
        return await trx
            .insertInto("post_accesses")
            .values(prepared)
            .onConflict((cb) => cb.columns(["type", "post_id", "subscription"]).doNothing())
            .execute();
    } else return [];
};

