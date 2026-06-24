import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

/**
 * Build the Prisma 7 driver adapter that matches DATABASE_URL.
 *
 * Prisma 7 connects to the database through a driver adapter rather than a
 * bundled query engine. We keep the project's "configurable database" property
 * by choosing the adapter from the connection string:
 *
 *   - `postgres://` / `postgresql://`  → PrismaPg     (node-postgres)
 *   - anything else (`file:…`)         → PrismaBetterSqlite3 (SQLite, the dev default)
 *
 * To switch to PostgreSQL/Supabase, set DATABASE_URL to the Postgres connection
 * string and change the datasource `provider` to "postgresql" in
 * prisma/schema.prisma — no code change is needed here.
 */
export function createDatabaseAdapter() {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db';

  if (/^postgres(ql)?:\/\//i.test(url)) {
    return new PrismaPg({ connectionString: url });
  }

  return new PrismaBetterSqlite3({ url });
}
