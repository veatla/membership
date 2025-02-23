import { TypeBoxError, type TSchema, type Static, type SchemaOptions } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import type { RequestHandler as ExpressRequestHandler, Request, Response } from "express";
import type { UsersTable } from "../components/user/schema/user.schema";
import APIError, { throw_err } from "../shared/lib/error";
import { Bearer } from "../shared/lib/jwt";

export const verifySchemaData = <T extends TSchema>(schema: T, options?: SchemaOptions) => {
    return Value.Parse<T>(schema, options);
};

type IfIsExists<Schema extends TSchema | undefined> = Schema extends TSchema ? Static<Schema> : undefined;

export interface RequestHandler<
    Body extends TSchema | undefined,
    Query extends TSchema | undefined,
    User extends UsersTable | undefined
> {
    (args: {
        body: IfIsExists<Body>;
        query: IfIsExists<Query>;
        user: User;
        params: Record<string, string>;
        status: (status: number) => void;
    }): any | Promise<any>;
}

interface ReqHandler {
    // // BODY NOT EXISTS
    // <Body extends unknown, Query extends unknown>(
    //     handler: RequestHandler<unknown, Query>,
    //     params?: {
    //         body?: unknown;
    //         query?: Query;
    //         response?: TSchema;
    //     }
    // ): ExpressRequestHandler;

    // // QUERY NOT EXISTS
    // <Body extends TSchema, Query extends unknown>(
    //     handler: RequestHandler<Body, unknown>,
    //     params: {
    //         body: Body;
    //         query?: unknown;
    //         response?: TSchema;
    //     }
    // ): ExpressRequestHandler;

    // // RESPONSE NOT EXISTS
    // <Body extends TSchema, Query extends TSchema>(
    //     handler: RequestHandler<Body, Query>,
    //     params: {
    //         body: Body;
    //         query: Query;
    //         response?: TSchema;
    //     }
    // ): ExpressRequestHandler;

    // // ONLY BODY EXISTS
    // <Body extends TSchema, Query extends unknown>(
    //     handler: RequestHandler<Body, unknown>,
    //     params: {
    //         body: Body;
    //         query?: Query;
    //         response?: TSchema;
    //     }
    // ): ExpressRequestHandler;

    // // ONLY QUERY EXISTS
    // <Body extends unknown, Query extends TSchema>(
    //     handler: RequestHandler<Body, Query>,
    //     params: {
    //         body?: Body;
    //         query: Query;
    //         response?: TSchema;
    //     }
    // ): ExpressRequestHandler;

    // // ONLY RESPONSE EXISTS
    // <Body extends unknown, Query extends unknown>(
    //     handler: RequestHandler<Body, Query>,
    //     params: {
    //         body?: Body;
    //         query?: Query;
    //         response?: TSchema;
    //     }
    // ): ExpressRequestHandler;

    <Body extends TSchema, Query extends TSchema, UserAuthRequired extends boolean = false>(
        handler: RequestHandler<Body, Query, UserAuthRequired extends true ? UsersTable : undefined>,
        params: {
            body?: Body;
            query?: Query;
            params?: Request["params"];
            response?: TSchema;
            authRequired?: UserAuthRequired;
        }
    ): ExpressRequestHandler;
}

const handler: ReqHandler = function (cb: any, params: any) {
    return async (req: Request, res: Response) => {
        try {
            const parsed_token = await Bearer.verify(req.headers["authorization"], "user").catch(() => undefined);
            const user = parsed_token?.user;
            if (parsed_token?.token) res.cookie("u_token", parsed_token.token);

            if ("authRequired" in params) {
                if (!user) throw_err("Unauthorized!", 401);
            }
            const response = await cb({
                body: params?.body ? verifySchemaData(params.body, req.body) : null,
                query: params?.query ? verifySchemaData(params.query, req.query) : null,

                params: params?.params ? verifySchemaData(params.params, req.params) : null,
                status: (status: number) => {
                    status;
                },
                user: user,
            });
            if (params?.response) res.send(verifySchemaData(params.response, response));
            else res.send(response);
        } catch (err) {
            console.log(err)
            if (err instanceof TypeBoxError) {
                res.send(err);
            } else if (err instanceof APIError) {
                res.status(err.status).send({ error: err });
            } else res.send({ error: err });
        }
    };
};

export default handler;
