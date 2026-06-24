import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';
import { isDatabaseConfigurationError } from '@/lib/db-status';
import { rateLimit, rateLimitReset } from '@/lib/rate-limit';

// Brute-force protection: at most 10 sign-in attempts per (account + IP) every
// 15 minutes. A successful login clears the counter so a legitimate admin is
// never penalised for occasional typos.
const LOGIN_MAX_ATTEMPTS = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function getRequestIp(req: unknown): string {
  const headers = (req as { headers?: Record<string, string | string[] | undefined> } | undefined)?.headers;
  const xff = headers?.['x-forwarded-for'] ?? headers?.['x-real-ip'];
  const value = Array.isArray(xff) ? xff[0] : xff;
  return value?.split(',')[0]?.trim() || 'unknown';
}

// Constant-time string comparison so the env-credential fallback does not leak
// information about the password through response timing.
function timingSafeStringEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        // Throttle repeated attempts against the same account from the same IP.
        // When the limit is hit we return null (the same as a wrong password) so
        // the lockout itself cannot be used to enumerate valid accounts.
        const rateKey = `${email}|${getRequestIp(req)}`;
        if (!rateLimit('login', rateKey, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS).allowed) {
          return null;
        }

        // Primary path: validate against the admin user stored in the database.
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (user) {
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return null;
            rateLimitReset('login', rateKey);
            return { id: user.id, email: user.email, name: user.name, role: user.role };
          }
        } catch (error) {
          // Only swallow "database not configured/reachable" errors so login can
          // fall back to env credentials during setup; rethrow anything else.
          if (!isDatabaseConfigurationError(error)) throw error;
        }

        // Fallback path (setup / DB unavailable): accept the ADMIN_EMAIL /
        // ADMIN_PASSWORD pair from the environment. This is intentionally
        // disabled unless BOTH are explicitly configured — there is no
        // hardcoded default credential, so an unconfigured deployment can
        // never be logged into.
        const fallbackEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const fallbackPassword = process.env.ADMIN_PASSWORD;
        if (
          fallbackEmail &&
          fallbackPassword &&
          timingSafeStringEqual(email, fallbackEmail) &&
          timingSafeStringEqual(password, fallbackPassword)
        ) {
          rateLimitReset('login', rateKey);
          return { id: 'fallback-admin', email: fallbackEmail, name: 'Admin', role: 'admin' };
        }

        return null;
      },
    }),
  ],
  // Short-lived admin sessions reduce the window in which a stolen JWT is useful.
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 },
  pages: { signIn: '/admin/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'admin';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
