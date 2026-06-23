export function isDatabaseConfigurationError(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes('Environment variable not found: DATABASE_URL') ||
    error.message.includes('Can\'t reach database server') ||
    error.message.includes('does not exist')
  );
}

export function databaseSetupMessage(): string {
  return 'The database is not set up yet. Make sure DATABASE_URL is set in .env, then run "npx prisma migrate deploy" followed by "npx prisma db seed" to create the tables and seed the admin user and properties.';
}
