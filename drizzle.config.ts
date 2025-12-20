import { defineConfig } from "drizzle-kit";

const {TURSO_DATABASE_URL , TURSO_AUTH_TOKEN} = process.env;
if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  throw new Error('Missing environment variables TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
}

export default defineConfig({
  dialect: 'turso',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  },
});
