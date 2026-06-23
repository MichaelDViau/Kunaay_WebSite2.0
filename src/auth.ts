import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { isDatabaseConfigurationError } from '@/lib/db-status';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;
        const fallbackEmail = (process.env.ADMIN_EMAIL ?? 'admin@kunaay.com').trim().toLowerCase();
        const fallbackPassword = process.env.ADMIN_PASSWORD ?? 'kunaay2026';

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (user) {
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return null;
            return { id: user.id, email: user.email, name: user.name, role: user.role };
          }
        } catch (error) {
          if (!isDatabaseConfigurationError(error)) throw error;
        }

        if (email === fallbackEmail && password === fallbackPassword) {
          return { id: 'fallback-admin', email: fallbackEmail, name: 'Admin', role: 'admin' };
        }

        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
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
