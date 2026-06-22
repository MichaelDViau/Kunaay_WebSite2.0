import { withAuth } from 'next-auth/middleware';

export default withAuth({ pages: { signIn: '/admin/login' } });

export const config = {
  // Protect the dashboard root (/admin) and every /admin/* route except the login page.
  matcher: ['/admin', '/admin/((?!login$).+)'],
};
