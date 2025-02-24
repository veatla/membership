import { Router } from "express";
import handler, { verifySchemaData } from "../../middleware/handler";
import multerConfig from "../../config/multer";
import { CreateMembershipTierSchema, GetMembershipByIdSchema } from "./dto/membership.dto";
import { createMembershipTiers } from "./lib/create-membership-tier";
import { Bearer } from "../../shared/lib/jwt";
import { getUsersMembershipSubscriptions } from "./lib/get-users-membership-subscriptions";
import { errorAsResponse } from "../../middleware/error-handler";
import { throw_err } from "../../shared/lib/error";
import { getAuthorMembershipTiers } from "./lib/get-author-membership-tiers";
import { GetUserByIdSchema } from "../user/dto/user.dto";
import { subscribeToAuthor } from "./lib/subscribe-to-author";

const memberships_router = Router();
const route_prefix = (path: string) => "/membership" + path;

memberships_router.post(route_prefix("/create"), multerConfig.array("cover", 1), async (req, res) => {
    try {
        // Parse Bearer token provided in request header
        const parsed_token = await Bearer.verify(req.headers["authorization"], "user");

        // Update users token after successfully check
        res.cookie("u_token", parsed_token.token);

        // If Route requires user authorization
        const user = parsed_token.user;

        const body = verifySchemaData(CreateMembershipTierSchema, req.body);

        if (!Array.isArray(req.files)) throw_err("Expected Array<File>, but got Record<string, File>");

        const cover = req.files?.[0];

        const data = await createMembershipTiers(body, cover, user);
        res.send(data);
    } catch (err) {
        errorAsResponse(res, err);
    }
});

memberships_router.get(
    route_prefix("/id/:id"),
    handler(({ user, params }) => getAuthorMembershipTiers(params.id, user?.id), {
        params: GetUserByIdSchema,
    })
);
memberships_router.post(
    route_prefix("/id/:id"),
    handler(({ user, params }) => subscribeToAuthor(params.id, user), {
        params: GetMembershipByIdSchema,
        authRequired: true,
    })
);

memberships_router.get(
    route_prefix("/my"),
    handler(({ user }) => getUsersMembershipSubscriptions(user.id), {
        authRequired: true,
    })
);

export default memberships_router;
