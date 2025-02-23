import express, { type ErrorRequestHandler } from "express";
import https from "https";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";
import ENV from "./environment";
import attachments_router from "./components/attachment/attachment.controller";
import posts_router from "./components/post/post.controller";
import users_router from "./components/user/user.controller";
import APIError, { throw_err } from "./shared/lib/error";
import { TypeBoxError } from "@sinclair/typebox";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", attachments_router);
app.use("/api", posts_router);
app.use("/api", users_router);
// routes

// app.use('/*', (req, res) => throw_err("Not found!", 404));

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof TypeBoxError) {
        res.send(err);
    } else if (err instanceof APIError) {
        res.status(err.status).send({ error: err });
    } else res.send({ error: err });
};

app.use(errorHandler);

const httpsOptions = {
    key: fs.readFileSync("./certificates/localhost-key.pem"),
    cert: fs.readFileSync("./certificates/localhost.pem"),
};

const server = https.createServer(httpsOptions, app);

server.listen(ENV.PORT, () => {
    console.log(`Server running at https://localhost:${ENV.PORT}/`);
});
