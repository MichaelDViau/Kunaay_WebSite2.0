import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

/**
 * Returns the current session only if the request is an authenticated admin.
 *
 * Every admin API route calls this before doing any work. It is the single
 * server-side authorization gate: the middleware protects the admin *pages*,
 * but the API routes must verify the session themselves (middleware does not
 * cover /api/admin/*). We also require role === 'admin' as defense-in-depth so
 * that, should a non-admin user ever be added, they still cannot mutate data.
 */
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const role = (session.user as { role?: string } | undefined)?.role;
  if (role && role !== 'admin') return null;
  return session;
}
