import type { AttachmentsReferenceTable, AttachmentsTable } from "../../components/attachment/schema/attachment.schema";
import type { PostAccessesTable, PostsTable } from "../../components/post/schema/post.schema";
import type { MembershipTierTable, MemberSubscriptionsTable } from "../../components/membership/schema/membership.schema";
import type { UsersRelationships, UsersTable } from "../../components/user/schema/user.schema";

export interface Database {
    users: UsersTable;
    user_relationships: UsersRelationships;

    attachments: AttachmentsTable;
    attachments_reference: AttachmentsReferenceTable;

    posts: PostsTable;
    post_accesses: PostAccessesTable;

    membership_tiers: MembershipTierTable;
    member_subscriptions: MemberSubscriptionsTable;
}
