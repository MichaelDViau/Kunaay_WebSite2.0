// Prisma 7 configuration.
//
// Prisma 7 no longer auto-loads `.env`, so we load it here (this file is read by
// the Prisma CLI before it parses the schema, so `env("DATABASE_URL")` in
// schema.prisma resolves). The application runtime does NOT use this file — it
// builds its own driver adapter from DATABASE_URL in src/lib/db-adapter.ts.
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Connection URL for Migrate / schema-engine commands (the app runtime uses a
  // driver adapter instead — see src/lib/db-adapter.ts).
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    // Run the seed via `prisma db seed` (the package.json#prisma key was removed
    // in Prisma 7 in favour of this config file). We use tsx because the Prisma 7
    // generated client is ESM and uses import.meta, which ts-node's CommonJS
    // transpile cannot run.
    seed: 'npx tsx prisma/seed.ts',
  },
});
