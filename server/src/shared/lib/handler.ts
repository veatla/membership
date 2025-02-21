import {
    TypeBoxError,
    type TSchema,
    type Static,
    type SchemaOptions,
} from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import type {
    RequestHandler as ExpressRequestHandler,
    Request,
    Response,
} from "express";

const parseSchema = <T extends TSchema>(
    schema: T,
    options?: SchemaOptions
) => {
    return Value.Parse<T>(schema, options);
};

type IfIsExists<Schema extends TSchema | unknown> = Schema extends TSchema
    ? Static<Schema>
    : null;

export interface RequestHandler<
    Body extends TSchema | unknown,
    Query extends TSchema | unknown
> {
    (args: {
        body: IfIsExists<Body> | unknown;
        query: IfIsExists<Query> | unknown;
        status: (status: number) => void;
    }): any | Promise<any>;
}

interface ReqHandler {
    // BODY NOT EXISTS
    <Body extends unknown, Query extends unknown>(
        handler: RequestHandler<unknown, Query>,
        params?: {
            body?: unknown;
            query?: Query;
            response?: TSchema;
        }
    ): ExpressRequestHandler;

    // QUERY NOT EXISTS
    <Body extends TSchema, Query extends unknown>(
        handler: RequestHandler<Body, unknown>,
        params: {
            body: Body;
            query?: unknown;
            response?: TSchema;
        }
    ): ExpressRequestHandler;

    // RESPONSE NOT EXISTS
    <Body extends TSchema, Query extends TSchema>(
        handler: RequestHandler<Body, Query>,
        params: {
            body: Body;
            query: Query;
            response?: TSchema;
        }
    ): ExpressRequestHandler;

    // ONLY BODY EXISTS
    <Body extends TSchema, Query extends unknown>(
        handler: RequestHandler<Body, unknown>,
        params: {
            body: Body;
            query?: Query;
            response?: TSchema;
        }
    ): ExpressRequestHandler;

    // ONLY QUERY EXISTS
    <Body extends unknown, Query extends TSchema>(
        handler: RequestHandler<Body, Query>,
        params: {
            body?: Body;
            query: Query;
            response?: TSchema;
        }
    ): ExpressRequestHandler;

    // ONLY RESPONSE EXISTS
    <Body extends unknown, Query extends unknown>(
        handler: RequestHandler<Body, Query>,
        params: {
            body?: Body;
            query?: Query;
            response?: TSchema;
        }
    ): ExpressRequestHandler;

    <Body extends TSchema, Query extends TSchema>(
        handler: RequestHandler<Body, Query>,
        params: {
            body: Body;
            query: Query;
            response?: TSchema;
        }
    ): ExpressRequestHandler;
}

const handler: ReqHandler = function <
    Body extends TSchema | never,
    Query extends TSchema | never
>(
    cb: RequestHandler<Body, Query>,
    params?: {
        body?: Body;
        query?: Query;
        response?: TSchema;
    }
) {
    return async (req: Request, res: Response) => {
        try {
            const response = await cb({
                body: params?.body ? parseSchema(params.body, req.body) : null,
                query: params?.query
                    ? parseSchema(params.query, req.query)
                    : null,
                status: (status) => {
                     (status);
                },
            });
            if (params?.response) res.send(parseSchema(params.response, response));
            else res.send(response);
        } catch (err) {
            if (err instanceof TypeBoxError) {
                res.send(err.message);
            } else res.send(err);
        }
    };
};

export default handler;
