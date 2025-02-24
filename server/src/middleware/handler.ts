import { TypeBoxError, type TSchema, type Static, type SchemaOptions } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import type { Request, Response } from "express";
import type { Profile, UsersTable } from "../components/user/schema/user.schema";
import APIError, { throw_err } from "../shared/lib/error";
import { Bearer } from "../shared/lib/jwt";

export const verifySchemaData = <T extends TSchema>(schema: T, options?: SchemaOptions) => {
    return Value.Parse<T>(schema, options);
};

function parseSchema<Type extends TSchema | undefined>(
    schema: Type,
    data: unknown
): IfIsExists<Exclude<Type, undefined>> {
    if (!schema || !data) return <IfIsExists<Exclude<Type, undefined>>>undefined;
    return <IfIsExists<Exclude<Type, undefined>>>verifySchemaData(schema, data);
}

type IfIsExists<Schema extends TSchema | undefined> = Schema extends TSchema ? Static<Schema> : undefined;

export interface RequestHandler<
    Body extends TSchema | undefined,
    Query extends TSchema | undefined,
    Params extends TSchema | undefined,
    User extends Profile | undefined
> {
    (args: {
        /** Parsed Body Schema Value */
        body: IfIsExists<Body>;

        /** Parsed Query Schema Value */
        query: IfIsExists<Query>;

        /** Returns `User` if set in `authRequired` in `params` */
        user: User;

        /** Parsed Route Params Schema Value  */
        params: IfIsExists<Params>;

        /** Function to set status code */
        status: (status: number) => void;
    }): any | Promise<any>;
}

export const errorHandler = (res: Response, err: unknown) => {
    // Verification errors
    if (err instanceof TypeBoxError) {
        res.send(err);
    }
    // Custom API errors
    else if (err instanceof APIError) {
        res.status(err.status).send({ error: err });
    }
    // Other errors that doesn't handled
    else {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error!" });
    }
};
const handler = function <
    Body extends TSchema,
    Query extends TSchema,
    Params extends TSchema,
    UserAuthRequired extends boolean = false
>(
    cb: RequestHandler<Body, Query, Params, UserAuthRequired extends true ? UsersTable : undefined>,
    options: {
        /** Body Schema */
        body?: Body;

        /** Query Schema */
        query?: Query;

        /** Params Schema */
        params?: Params;

        /** Response Schema */
        response?: TSchema;

        /** Whenever route is requires  */
        authRequired?: UserAuthRequired;
    }
) {
    const {
        authRequired = false,
        body: bodySchema,
        query: querySchema,
        params: paramsSchema,
        response: responseSchema,
    } = options;
    return async (req: Request, res: Response) => {
        try {
            // Parse Bearer token provided in request header
            const parsed_token = await Bearer.verify(req.headers["authorization"], "user").catch(() => null);

            // Update users token after successfully check
            if (parsed_token?.token) res.cookie("u_token", parsed_token.token);

            // If Route requires user authorization
            const user = parsed_token?.user;
            if (authRequired && !user) throw_err("Unauthorized!", 401);

            // Response status
            let status = 200;

            const response = await cb({
                body: parseSchema(bodySchema, req.body),
                query: parseSchema(querySchema, req.query),
                params: parseSchema(paramsSchema, req.params),
                status: (set: number) => {
                    status = set;
                },
                user: user as UserAuthRequired extends true ? UsersTable : undefined,
            });

            res.status(status);

            // If response schema type in the options - parse callback value
            if (responseSchema) res.send(verifySchemaData(responseSchema, response));
            // Otherwise just return
            else res.send(response);
        } catch (err) {
            errorHandler(res, err);
        }
    };
};

export default handler;
