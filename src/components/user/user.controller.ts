import { Router } from "express";
import handler from "../../middleware/handler";
import { CreateUserSchema, GetUserByIdSchema, LoginSchema } from "./dto/user.dto";
import { createUser } from "./lib/create-user";
import { loginUser } from "./lib/login-user";
import { getUser } from "./lib/get-user";

const users_router = Router();
const route_prefix = (path: string) => "/user" + path;

users_router.post(
    route_prefix("/register"),
    handler(({ body }) => createUser(body), {
        body: CreateUserSchema,
    })
);

users_router.post(
    route_prefix("/login"),
    handler(({ body }) => loginUser(body), {
        body: LoginSchema,
    })
);

users_router.get(
    route_prefix("/id/:id"),
    handler(({ params, user }) => getUser(params.id, user.id), {
        params: GetUserByIdSchema,
        authRequired: true,
    })
);

users_router.get(
    route_prefix("/me"),
    handler(({ user }) => user, {
        authRequired: true,
    })
);


export default users_router;
