import type { AttachmentsReferenceTable, AttachmentsTable } from "../../components/attachment/schema/attachment.schema";
import type { PostAccesses, PostsTable } from "../../components/post/schema/post.schema";
import type { UsersRelationships, UsersTable } from "../../components/user/schema/user.schema";

export interface Database {
    users: UsersTable;
    user_relationships: UsersRelationships;

    attachments: AttachmentsTable;
    attachments_reference: AttachmentsReferenceTable;

    posts: PostsTable;
    post_accesses: PostAccesses;
}
