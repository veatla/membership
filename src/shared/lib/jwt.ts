import jwt from "jsonwebtoken";
import ENV from "../../environment";
import { throw_err } from "./error";
import db from "../../config/db";

interface JWTData {
    user_id: string;
}

export const Bearer = {
    sign: (data: JWTData) => {
        return jwt.sign(data, ENV.JWT_SECRET, {
            expiresIn: `4W`,
        });
    },

    decode: (data: string) => {
        try {
            const parsed = jwt.verify(data, ENV.JWT_SECRET);
            if (typeof parsed === "string") throw_err("Invalid token");

            return <JWTData & jwt.JwtPayload>parsed;
        } catch (error) {
            throw_err("Unauthorized!", 401);
        }
    },

    verify: async (bearer?: string, type: "user" | (string & NonNullable<unknown>) = "user") => {
        if (!bearer) throw_err("Unauthorized!", 401);
        const [prefix, token] = bearer.split(" ");
        if (prefix !== "Bearer" || !token.length) {
            throw_err("Unauthorized!", 401);
        }

        const decoded = Bearer.decode(token);

        if (type === "user") {
            const user = await db
                .selectFrom("users")
                .where("users.id", "=", decoded.user_id)
                .selectAll()
                .executeTakeFirst();

            if (!user) throw_err("Unauthorized!", 401);

            // Update & generate new token for user
            const generated = Bearer.sign({
                user_id: user.id,
            });
            const { password, ...rest } = user;
            return {
                user: rest,
                token: generated,
            };
        }

        throw_err("Unsupported type of verification!");
    },
};
