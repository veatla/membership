import { Router } from "express";
import handler from "../../middleware/handler";

const posts_router = Router();
const route_prefix = (path: string) => "/post" + path;

posts_router.post(
    route_prefix("/register"),
    handler(({ body }) => null, {})
);

posts_router.post(
    route_prefix("/login"),
    handler(({ body }) => null, {})
);

posts_router.get(
    route_prefix("/id/:id"),
    handler(({ body }) => null, {})
);

posts_router.get(
    route_prefix("/me"),
    handler(({ body }) => null, {})
);

posts_router.get(
    route_prefix("/"),
    handler(({ body }) => null, {})
);

export default posts_router;
