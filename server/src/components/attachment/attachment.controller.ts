import { Router } from "express";
import handler from "../../middleware/handler";
import multerConfig from "../../config/multer";
import { throw_err } from "../../shared/lib/error";
import { create_upload_file_worker } from "./workers/upload";
import { Bearer } from "../../shared/lib/jwt";

const attachments_router = Router();
const route_prefix = (path: string) => "/attachments" + path;

attachments_router.post(route_prefix("/upload"), multerConfig.array("files", 5), async (req, res) => {
    try {
        const parsed_token = await Bearer.verify(req.headers["authorization"], "user");
        const files = req.files;

        if (!files) throw_err("Expected files");
        if (!Array.isArray(files)) throw_err("Something unexpected happened");
        const data = await create_upload_file_worker(files, parsed_token.user);
        res.send(data);
    } catch (err) {
        res.send(err);
    }
});

attachments_router.get(
    route_prefix("/id/:id"),
    handler(({ params }) => {
        const id = params.id;
        return id;
    }, {})
);

export default attachments_router;
