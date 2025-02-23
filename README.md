In development.

It's supposed to be application like a Patreon, Boosty.

## Backend

.env

```
PORT=3030
PG_PORT=5432
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=admin
PG_DATABASE=membership

JWT_SECRET=someRandomString

STRIPE_PUBLIC_KEY=stripePublicKey
STRIPE_SECRET_KEY=stripeSecretKey - Used to create subscriptions & customers

SUPABASE_STORAGE_URL=https://[project_id].supabase.co/storage/v1
STORAGE_ACCESS_ID=SUPABASE_S3_ACCESS_ID
STORAGE_SECRET_KEY=SUPABASE_S3_SECRET_KEY
STORAGE_BUCKET_NAME=attachments_bucket_name

```

TODO:

-   Backend: Create User = Ok
-   Backend: Encryption Users Password = Ok
-   Backend: Migration code = Ok
-   Backend: Get Profile = Ok
-   Backend: Create Post = Ok
-   Backend: Upload Files = Ok
-   Backend: Use Worker Thread To Upload Files = Ok
-   Backend: Format Files. ex.: Create low quality thumbnails for images & videos = Backlog
-   Backend: Enable upload Executable apps. Check for viruses - Backlog...Idk I need this or not.
-   Backend: View posts = Ok
-   Backend: Access Management = Todo
-   Backend: Create custom subscriptions plans = Todo
-   Backend: Enable to blocking users = Todo
-   Backend: Private users = Todo
-   Backend: Closed posts only for subscribers = Todo
-   Backend: Donate to view post = Todo
-   Backend: Messages = Todo
-   Backend: End to End Encryption to Messages = Todo
-   Backend: Verification user by email & phone = Todo
-   Backend: Restore account with email or phone = Todo
-   Backend: Support tickets

## Mobile

-   Mobile: UI = Backlog

...
