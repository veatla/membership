import { sql } from "kysely";
import bcrypt from "bcrypt";
import type { Login } from "./../dto/user.dto";
import { throw_err } from "../../../shared/lib/error";
import db from "../../../config/db";
import { Bearer } from "../../../shared/lib/jwt";

export const loginUser = async (body: Login) => {
    const user = await db.selectFrom("users").where("email", "=", body.email).selectAll().executeTakeFirst();

    if (!user) throw_err("Password or emails is incorrect", 400);

    const { password, ...rest } = user;
    const is_equal = await bcrypt.compare(body.password, password);

    if (!is_equal) throw_err("Password or emails is incorrect", 400);

    const token = Bearer.sign({ user_id: user.id });

    return { token, user: rest };
};