import type { IndexType, Kysely } from "kysely";
import type { Database } from "../shared/types/database";

export const createIndex = async <Key extends keyof Database>(params: {
    db: Kysely<Database>;
    table: Key;
    indexes: Array<{
        cols: Array<keyof Database[Key]>;
        using: IndexType;
    }>;
}) => {
    const { db, indexes, table } = params;
    for await (const { cols, using } of indexes) {
        await db.schema
            .createIndex(`${table}_${cols.join("_")}_index`)
            .on(table)
            .columns(cols.map((v) => String(v)))
            .using(using)
            .execute();
    }
};
