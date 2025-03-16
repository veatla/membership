if (!process.env.NODE_ENV) {
    throw new Error('Set NODE_ENV to development or production')
}
const ENV = {
    PORT: Number(String(process.env.PORT)),
    PG_PORT: Number(String(process.env.PG_PORT)),
    PG_HOST: String(process.env.PG_HOST),
    PG_USER: String(process.env.PG_USER),
    PG_PASSWORD: String(process.env.PG_PASSWORD),
    PG_DATABASE: String(process.env.PG_DATABASE),

    JWT_SECRET: String(process.env.JWT_SECRET),

    STRIPE_SECRET_KEY: String(process.env.STRIPE_SECRET_KEY),
    STRIPE_PUBLIC_KEY: String(process.env.STRIPE_PUBLIC_KEY),

    SUPABASE_STORAGE_URL: String(process.env.SUPABASE_STORAGE_URL),
    STORAGE_ACCESS_ID: String(process.env.STORAGE_ACCESS_ID),
    STORAGE_SECRET_KEY: String(process.env.STORAGE_SECRET_KEY),
    STORAGE_BUCKET_NAME: String(process.env.STORAGE_BUCKET_NAME),
    NODE_ENV: String(process.env.NODE_ENV),
};

if (isNaN(ENV.PORT) || isNaN(ENV.PG_PORT)) process.exit(1);
if (Object.values(ENV).some((v) => !v)) process.exit(1);

export default ENV;
