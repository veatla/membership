import { Router } from "express";
import handler, { errorHandler, verifySchemaData } from "../../middleware/handler";
import multerConfig from "../../config/multer";
import { CreateMembershipTierSchema } from "./dto/membership-tiers.dto";
import { createMembershipTiers } from "./lib/create-membership-tier";
import { Bearer } from "../../shared/lib/jwt";

const membership_tiers_router = Router();
const route_prefix = (path: string) => "/membership-tiers" + path;

membership_tiers_router.post(
    route_prefix("/create"),
    multerConfig.single('cover'),
    async (req, res) => {
        try {
            // Parse Bearer token provided in request header
            const parsed_token = await Bearer.verify(req.headers["authorization"], "user");

            // Update users token after successfully check
            res.cookie("u_token", parsed_token.token);

            // If Route requires user authorization
            const user = parsed_token.user;

            const body = verifySchemaData(CreateMembershipTierSchema, req.body);
            const cover = req.file;
            
            const data = await createMembershipTiers(body, cover, user);
            res.send(data);
        } catch (err) {
            errorHandler(res, err);
        }
    }
);

membership_tiers_router.get(
    route_prefix("/id/:id"),
    handler(
        ({ user }) => {
            return true;
        },
        {
            authRequired: true,
        }
    )
);

membership_tiers_router.get(
    route_prefix("/my"),
    handler(
        ({ user }) => {
            return true;
        },
        {
            authRequired: true,
        }
    )
);

export default membership_tiers_router;
