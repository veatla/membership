import { Router } from "express";
import handler from "../../middleware/handler";

const router = Router();
const route_prefix = (path: string) => "/post" + path;

router.post(
    route_prefix("/register"),
    handler(({ body }) => null, {})
);

router.post(
    route_prefix("/login"),
    handler(({ body }) => null, {})
);

router.get(
    route_prefix("/id/:id"),
    handler(({ body }) => null, {})
);

router.get(
    route_prefix("/me"),
    handler(({ body }) => null, {})
);

router.get(
    route_prefix("/"),
    handler(({ body }) => null, {})
);

export default router;
