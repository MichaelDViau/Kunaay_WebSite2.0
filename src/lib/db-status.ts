export function isDatabaseConfigurationError(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes('Environment variable not found: DATABASE_URL') ||
    error.message.includes('Can\'t reach database server') ||
    error.message.includes('does not exist')
  );
}

export function databaseSetupMessage(): string {
  return 'Database is not configured. Add DATABASE_URL (Supabase pooled or direct PostgreSQL URL, or a local SQLite URL) and rerun Prisma migrations.';
}
