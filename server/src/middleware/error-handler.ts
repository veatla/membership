import { TypeBoxError } from "@sinclair/typebox";
import type { ErrorRequestHandler, Response } from "express";
import APIError from "../shared/lib/error";
import { MulterError } from "multer";

export const errorAsResponse = (res: Response, err: unknown) => {
    console.log(res);
    // Verification errors
    if (err instanceof TypeBoxError) {
        res.send(err);
    } else if (err instanceof MulterError) {
        res.status(422).send({
            error: {
                message: err.message,
                field: err.field,
                code: err.code,
            },
        });
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

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    errorAsResponse(res, err);
};
