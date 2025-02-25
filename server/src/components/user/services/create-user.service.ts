import db from "../../../config/db";
import { UserState } from "../../../constants/access";
import { throw_err } from "../../../shared/lib/error";
import { Bearer } from "../../../shared/lib/jwt";
import uid from "../../../shared/lib/uid";
import bcrypt from "bcrypt";
import type { CreateUser } from "../dto/user.dto";
import { customAlphabet } from "nanoid";

const salt = 12;

const username_suffix = customAlphabet("123456789._", 24);
const create_username = (username = "", email: string) => {
    if (username.length > 3) return username;

    const suffix = username_suffix();
    const length = Math.floor(Math.random() * 3) + 1;
    const sliced = "_".padEnd(length, suffix);

    return email.replace(/@(\S+)$/, sliced);
};
export const createUser = async (body: CreateUser) => {
    const is_exists = await db
        .selectFrom("users")
        .$if(Boolean(body.username), (cb) =>
            cb.where((cb) => cb.or([cb("username", "=", body.username!), cb("email", "=", body.email)]))
        )
        .$if(!body.username, (cb) => cb.where("email", "=", body.email))
        .selectAll()
        .executeTakeFirst();

    if (is_exists) {
        if (is_exists.email === body.email) throw_err("User with this email already exists", 400);
        if (is_exists.username === body.username) throw_err("User with this username already exists", 400);
    }

    const hashed_password = await bcrypt.hash(body.password, salt);

    const user = await db
        .insertInto("users")
        .values({
            id: uid("USER"),
            email: body.email,
            password: hashed_password,
            username: create_username(body.username, body.email),
            birthday: body.birthday,
            display_name: null,
            phone: null,
            state: UserState.PUBLIC,
            stripe_customer_id: null,
            stripe_product_id: null,
        })
        .returningAll()
        .executeTakeFirst();

    if (!user) throw_err("Something went wrong! Please try again!");

    const token = Bearer.sign({ user_id: user.id });

    const { password, ...rest } = user;
    return { token, user: rest };
};
