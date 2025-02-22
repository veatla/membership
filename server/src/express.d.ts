import type { UsersTable } from "./components/user/schema/user.schema";
declare global {
    declare namespace Express {
        export interface Locals {
            user?: UsersTable;
        }
    }
}
