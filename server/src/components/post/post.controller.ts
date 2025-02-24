import { Router } from "express";
import handler, { verifySchemaData } from "../../middleware/handler";
import { CreatePostSchema } from "./dto/post.dto";
import multerConfig from "../../config/multer";
import { throw_err } from "../../shared/lib/error";
import { Bearer } from "../../shared/lib/jwt";
import { GetUserByIdSchema } from "../user/dto/user.dto";
import { create_post } from "./lib/create-post.lib";
import { getUserPosts } from "./lib/get-user-post";

const posts_router = Router();
const route_prefix = (path: string) => "/post" + path;

posts_router.post(route_prefix("/create"), multerConfig.array("files", 5), async (req, res, next) => {
    try {
        const parsed_token = await Bearer.verify(req.headers["authorization"], "user");

        if (parsed_token.token) res.cookie("u_token", parsed_token.token);
        if (!Array.isArray(req.files)) throw_err("Expected an array of files.", 500);
        const body = verifySchemaData(CreatePostSchema, req.body);
        const data = await create_post(body, parsed_token.user.id, req.files);
        res.send(data);
    } catch (err) {
        next(err);
    }
});

posts_router.get(
    route_prefix("/id/:id"),
    handler(({ user, params }) => getUserPosts(params.id, user.id), {
        authRequired: true,
        params: GetUserByIdSchema,
    })
);

posts_router.get(
    route_prefix("/my"),
    handler(({ user }) => getUserPosts(user.id, user.id), {
        authRequired: true,
    })
);

export default posts_router;
