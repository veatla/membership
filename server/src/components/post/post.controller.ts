import { Router } from "express";
import handler, { verifySchemaData } from "../../middleware/handler";
import { CreatePostSchema } from "./dto/post.dto";
import { createPost, getUserPosts } from "./post.service";
import multerConfig from "../../config/multer";
import { throw_err } from "../../shared/lib/error";
import { Bearer } from "../../shared/lib/jwt";
import { create_upload_file_worker } from "../attachment/workers/upload";
import { GetUserByIdSchema } from "../user/dto/user.dto";

const posts_router = Router();
const route_prefix = (path: string) => "/post" + path;

posts_router.post(route_prefix("/create"), multerConfig.array("files", 5), async (req, res, next) => {
    try {
        const parsed_token = await Bearer.verify(req.headers["authorization"], "user");

        if (parsed_token.token) res.cookie("u_token", parsed_token.token);

        const files: Array<string> = [];

        if (req.files?.length) {
            if (!Array.isArray(req.files)) throw_err("Something unexpected happened");
            const data = await create_upload_file_worker(req.files, parsed_token.user.id);
            files.push(...data.result.map((v) => v.id));
        }
        const body = verifySchemaData(CreatePostSchema, req.body);
        const data = await createPost({ ...body, files }, parsed_token.user.id);

        res.send(data);
    } catch (err) {
        console.log(`Error`, err);
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
