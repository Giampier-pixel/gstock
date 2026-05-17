import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { apiLogin } from '@/lib/api/login';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? '');
        const password = String(credentials?.password ?? '');
        if (!username || !password) return null;

        const result = await apiLogin(username, password);
        if (!result) return null;

        return {
          id: result.user.id,
          username: result.user.username,
          name: result.user.name,
          email: result.user.email,
          accessToken: result.accessToken,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.username = user.username;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) session.accessToken = token.accessToken;
      if (token.sub) session.user.id = token.sub;
      if (token.username) session.user.username = token.username;
      return session;
    },
  },
});
