const ENV = {
    PORT: Number(process.env.PORT!),
    PG_PORT: Number(process.env.PG_PORT!),
    PG_HOST: process.env.PG_HOST!,
    PG_USER: process.env.PG_USER!,
    PG_PASSWORD: process.env.PG_PASSWORD!,
    PG_DATABASE: process.env.PG_DATABASE!,
    
    JWT_SECRET: process.env.JWT_SECRET!,
    
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY!,

    STORAGE_URL: process.env.STORAGE_URL!,
    STORAGE_ACCESS_ID: process.env.STORAGE_ACCESS_ID!,
    STORAGE_ACCESS_KEY: process.env.STORAGE_ACCESS_KEY!,
    STORAGE_BUCKET_NAME: process.env.STORAGE_BUCKET_NAME!,
};

if (isNaN(ENV.PORT) || isNaN(ENV.PG_PORT)) process.exit(1);
if (Object.values(ENV).some((v) => !v)) process.exit(1);

export default ENV;
