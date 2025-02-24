import { attachmentTable } from "./components/attachment/schema/attachment.schema";
import { membershipTierTable, memberSubscriptionsTable } from "./components/membership/schema/membership.schema";
import { postAccessesTable, postsTable } from "./components/post/schema/post.schema";
import { usersTable } from "./components/user/schema/user.schema";
import db from "./config/db";
import { init_postgres_fn } from "./shared/lib/kysely";

const migrate = async () => {
    await init_postgres_fn();
    if (process.argv.includes("--hard")) {
        await postAccessesTable.down(db);
        await memberSubscriptionsTable.down(db);
        await membershipTierTable.down(db);
        await postsTable.down(db);
        await attachmentTable.down(db);
        await usersTable.down(db);
    }

    await usersTable.up(db);
    await postsTable.up(db);
    await attachmentTable.up(db);
    await membershipTierTable.up(db);
    await memberSubscriptionsTable.up(db);
    await postAccessesTable.up(db);
};

migrate().catch(err => {
    console.log(err);
}).finally(() => process.exit(0));
