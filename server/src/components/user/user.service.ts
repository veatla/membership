import db from "../../config/db";
import { throw_err } from "../../shared/lib/error";
import uid from "../../shared/lib/uid";
import type { CreateUser, Login } from "./dto/user.dto";

export const createUser = async (body: CreateUser) => {
    const is_exists = await db
        .selectFrom("users")
        .where((cb) => cb("email", "=", body.email))
        .selectAll()
        .executeTakeFirst();

    if (!is_exists) throw_err("User with this id already exists");

    const user = await db
        .insertInto("users")
        .values({
            id: uid("USER"),
            email: body.email,
            password: body.password,
            username: body.username,
            birthday: body.birthday,
            display_name: null,
            phone: null,
        })
        .onConflict((cb) =>
            cb.column("id").doUpdateSet({
                id: uid("USER"),
            })
        )
        .execute();
};

export const loginUser = (body: Login) => {};
