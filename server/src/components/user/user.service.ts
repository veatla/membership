import { sql } from "kysely";
import db from "../../config/db";
import { UserState } from "../../constants/access";
import { throw_err } from "../../shared/lib/error";
import { Bearer } from "../../shared/lib/jwt";
import uid from "../../shared/lib/uid";
import bcrypt from "bcrypt";
import type { CreateUser, Login } from "./dto/user.dto";
import type { UsersTable } from "./schema/user.schema";
import stripe from "../../config/stripe";
import { customAlphabet } from "nanoid";

const salt = 12;

const username_suffix = customAlphabet("123456789._", 24);
const create_username = (username = "", email: string) => {
    if (username.length > 3) return username;

    const suffix = username_suffix();
    const length = Math.floor(Math.random() * 3) + 1;
    const sliced = "_".padStart(length, suffix);

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
        })
        .returningAll()
        .executeTakeFirst();

    if (!user) throw_err("Something went wrong! Please try again!");

    const token = Bearer.sign({ user_id: user.id });

    const { password, ...rest } = user;
    return { token, user: rest };
};

export const loginUser = async (body: Login) => {
    const user = await db.selectFrom("users").where("email", "=", body.email).selectAll().executeTakeFirst();

    if (!user) throw_err("Password or emails is incorrect", 400);

    const { password, ...rest } = user;
    const is_equal = await bcrypt.compare(body.password, password);

    if (!is_equal) throw_err("Password or emails is incorrect", 400);

    const token = Bearer.sign({ user_id: user.id });

    return { token, user: rest };
};

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
