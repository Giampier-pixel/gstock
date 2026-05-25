import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;
      const isAuthPage = pathname === '/login' || pathname === '/recuperar-password';
      const isPublicAsset =
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname === '/favicon.ico';

      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', request.nextUrl));
        return true;
      }
      if (isPublicAsset) return true;
      if (!isLoggedIn) return false;
      return true;
    },
  },
} satisfies NextAuthConfig;
