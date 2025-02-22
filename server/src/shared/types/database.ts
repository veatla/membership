import type { UsersRelationships, UsersTable } from "../../components/user/schema/user.schema";

export interface Database {
    users: UsersTable;
    user_relationships: UsersRelationships;
}
