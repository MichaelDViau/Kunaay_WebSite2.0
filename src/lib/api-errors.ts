import { Prisma } from '@/generated/prisma/client';

/**
 * Turns a thrown error into a clean, user-facing message plus a concise
 * technical detail that is safe to surface in the admin panel for debugging.
 * The detail never includes stack traces — just the actionable reason.
 */
export function describeError(err: unknown): { message: string; detail: string } {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[] | string | undefined);
        const fields = Array.isArray(target) ? target.join(', ') : target;
        return {
          message: fields?.includes('slug')
            ? 'A property with this slug already exists.'
            : 'A record with these details already exists.',
          detail: `Unique constraint failed${fields ? ` on: ${fields}` : ''} (P2002).`,
        };
      }
      case 'P2003':
        return {
          message: 'A linked record (such as an amenity) is missing or invalid.',
          detail: `Foreign key constraint failed (P2003): ${err.message}`,
        };
      case 'P2025':
        return {
          message: 'The requested property could not be found.',
          detail: `Record not found (P2025): ${err.message}`,
        };
      default:
        return {
          message: 'A database error occurred while saving.',
          detail: `Prisma ${err.code}: ${err.message}`,
        };
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return {
      message: 'Some property fields have an invalid value. Please review the form and try again.',
      detail: `Validation error: ${err.message.split('\n').slice(-3).join(' ').trim()}`,
    };
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      message: 'The database is not reachable. Check that it is configured and running.',
      detail: `Database initialization error: ${err.message}`,
    };
  }

  if (err instanceof Error) {
    return { message: 'An unexpected error occurred while saving.', detail: err.message };
  }

  return { message: 'An unexpected error occurred while saving.', detail: String(err) };
}
