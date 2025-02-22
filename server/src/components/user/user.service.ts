import db from "../../config/db";
import { UserState } from "../../shared/constants/access";
import { throw_err } from "../../shared/lib/error";
import { Bearer } from "../../shared/lib/jwt";
import uid from "../../shared/lib/uid";
import type { CreateUser, Login } from "./dto/user.dto";
import bcrypt from "bcrypt";

const salt = 12;

export const createUser = async (body: CreateUser) => {
    const is_exists = await db
        .selectFrom("users")
        .where("email", "=", body.email)
        .$if(Boolean(body.username), (cb) =>
            cb.where((cb) => cb("username", "=", body.username!))
        )
        .selectAll()
        .executeTakeFirst();

    if (is_exists) {
        if (is_exists.email === body.email)
            throw_err("User with this email already exists", 400);
        if (is_exists.username === body.username)
            throw_err("User with this username already exists", 400);
    }

    const hashed_password = await bcrypt.hash(body.password, salt);

    const user = await db
        .insertInto("users")
        .values({
            id: uid("USER"),
            email: body.email,
            password: hashed_password,
            username: body.username,
            birthday: body.birthday,
            display_name: null,
            phone: null,
            state: UserState.PUBLIC,
        })
        .onConflict((cb) =>
            cb.column("id").doUpdateSet({
                id: uid("USER"),
            })
        )
        .returningAll()
        .executeTakeFirstOrThrow();

    const token = Bearer.sign({ user_id: user.id });

    return { token, user };
};

export const loginUser = async (body: Login) => {
    const user = await db
        .selectFrom("users")
        .where("email", "=", body.email)
        .selectAll()
        .executeTakeFirst();

    if (!user) throw_err("Password or emails is incorrect", 400);

    const password = await bcrypt.compare(body.password, user.password);

    if (!password) throw_err("Password or emails is incorrect", 400);

    const token = Bearer.sign({ user_id: user.id });

    return { token, user };
};


export const getUser = async (user_id: string, profile: string) => {
    
}
