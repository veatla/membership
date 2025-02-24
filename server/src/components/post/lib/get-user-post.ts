import db from "../../../config/db";

export const getUserPosts = async (author: string, profile: string) => {
    const is_me = author === profile;
    return await db.transaction().execute(async (trx) => {
        return trx
            .selectFrom("posts as p")
            .selectAll("p")
            .$if(!is_me, (cb) =>
                cb.innerJoin("post_accesses as pa", (qb) =>
                    qb
                        // Check for user id === requesting user id
                        .on("pa.user_id", "=", profile)
                        // Check access for exactly this post
                        .onRef("pa.post_id", "=", "p.id")
                )
            )
            .innerJoinLateral(
                (cb) =>
                    cb
                        .selectFrom("attachments_reference as ar")
                        .whereRef("ar.post_id", "=", "p.id")
                        .innerJoin("attachments", "attachments.id", "ar.attachment_id")
                        .selectAll("attachments")
                        .as("attaches"),
                (cb) => cb.onTrue()
            )
            .selectAll("p")
            .groupBy(["p.id"])
            .select((cb) => cb.fn.jsonAgg("attaches").filterWhere("attaches.id", "is not", null).as("attachments"))
            .execute();
    });
};
