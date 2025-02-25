import { sql } from "kysely";
import db from "../../../config/db";

export const getUser = async (user_id: string, profile: string) => {
    const user = await db
        .selectFrom("users as u")
        .where("u.id", "=", user_id)
        .where("u.username", "=", user_id)
        .leftJoin(
            (cb) =>
                cb
                    .selectFrom("user_relationships as ur_p")
                    .where((cb) =>
                        cb.or([
                            cb.and([sql<boolean>`u.id = ur_p.user_id`, cb("ur_p.related_id", "=", profile)]),
                            cb.and([sql<boolean>`u.id = ur_p.related_id`, cb("ur_p.user_id", "=", profile)]),
                        ])
                    )
                    .selectAll("ur_p")
                    .as("ur"),

            (cb) => cb.onTrue()
        )
        .select(["u.id", "u.display_name", "u.username", "u.phone", "u.email", "u.state"])
        .select("ur.state")
        .executeTakeFirst();

    return user;
};
