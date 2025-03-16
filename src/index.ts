import express, { type ErrorRequestHandler } from "express";
import https from "https";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";
import ENV from "./environment";
import attachments_router from "./components/attachment/attachment.controller";
import posts_router from "./components/post/post.controller";
import users_router from "./components/user/user.controller";
import memberships_router from "./components/membership/membership.controller";
import { errorHandler } from "./middleware/error-handler";
declare global {
    interface BigInt {
        /** Convert to BigInt to string form in JSON.stringify */
        toJSON: () => string;
    }
}
BigInt.prototype.toJSON = function () {
    return this.toString();
};
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", attachments_router);
app.use("/api", posts_router);
app.use("/api", users_router);
app.use("/api", memberships_router);
// routes

// app.use('/*', (req, res) => throw_err("Not found!", 404));

app.use(errorHandler);

const httpsOptions = {
    key: fs.readFileSync("./certificates/localhost-key.pem"),
    cert: fs.readFileSync("./certificates/localhost.pem"),
};

const server = https.createServer(httpsOptions, app);

server.listen(ENV.PORT, () => {
    console.log(`Server running at https://localhost:${ENV.PORT}/`);
});
