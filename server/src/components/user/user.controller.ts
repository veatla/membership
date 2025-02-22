import { Router } from "express";
import handler from "../../middleware/handler";
import { createUser, getUser, loginUser } from "./user.service";
import { CreateUserSchema, LoginSchema } from "./dto/user.dto";

const router = Router();
const route_prefix = (path: string) => "/user" + path;

router.post(
    route_prefix("/register"),
    handler(({ body }) => createUser(body), {
        body: CreateUserSchema,
    })
);

router.post(
    route_prefix("/login"),
    handler(({ body }) => loginUser(body), {
        body: LoginSchema,
    })
);

router.get(
    route_prefix("/id/:id"),
    handler(({ params, user }) => getUser(params.id, user.id), {
        params: LoginSchema,
        authRequired: true,
    })
);

router.get(
    route_prefix("/me"),
    handler(({ user }) => user, {
        authRequired: true,
    })
);

router.get(
    route_prefix("/"),
    handler(({ user }) => user, {
        authRequired: true,
    })
);

export default router;
