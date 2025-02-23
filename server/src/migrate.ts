import { attachmentTable } from "./components/attachment/schema/attachment.schema";
import { postsTable } from "./components/post/schema/post.schema";
import { usersTable } from "./components/user/schema/user.schema";
import db from "./config/db";
import { init_postgres_fn } from "./shared/lib/kysely";

const migrate = async () => {
    await init_postgres_fn();

    await usersTable.up(db);
    await postsTable.up(db);
    await attachmentTable.up(db);
};

migrate().catch(err => {
    console.log(err);
}).finally(() => process.exit(0));
