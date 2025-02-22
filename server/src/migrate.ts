import { usersTable } from "./components/user/schema/user.schema";
import db from "./config/db";
import { init_postgres_fn } from "./shared/lib/kysely";

const migrate = async () => {
    await init_postgres_fn();

    await usersTable.up(db);
};

await migrate().finally(() => process.exit(0));
