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
          emailNotifications: result.user.emailNotifications,
          darkMode: result.user.darkMode,
          accessToken: result.accessToken,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.username = user.username;
        token.sub = user.id;
        token.emailNotifications = user.emailNotifications;
        token.darkMode = user.darkMode;
      }
      if (trigger === 'update' && session?.user) {
        if (typeof session.user.name === 'string') token.name = session.user.name;
        if (typeof session.user.email === 'string') token.email = session.user.email;
        if (typeof session.user.emailNotifications === 'boolean') {
          token.emailNotifications = session.user.emailNotifications;
        }
        if (typeof session.user.darkMode === 'boolean') {
          token.darkMode = session.user.darkMode;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) session.accessToken = token.accessToken;
      if (token.sub) session.user.id = token.sub;
      if (token.username) session.user.username = token.username;
      if (typeof token.emailNotifications === 'boolean') {
        session.user.emailNotifications = token.emailNotifications;
      }
      if (typeof token.darkMode === 'boolean') {
        session.user.darkMode = token.darkMode;
      }
      return session;
    },
  },
});
