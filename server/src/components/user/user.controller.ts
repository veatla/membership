import { Router } from "express";
import handler from "../../middleware/handler";
import { createUser, getUser, loginUser } from "./user.service";
import { CreateUserSchema, GetUserByIdSchema, LoginSchema } from "./dto/user.dto";

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
