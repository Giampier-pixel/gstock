import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from '@/auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const u = process.env.ADMIN_USER;
        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!u || !hash) return null;

        const username = String(credentials?.username ?? '');
        const password = String(credentials?.password ?? '');
        if (username !== u) return null;

        const ok = await bcrypt.compare(password, hash);
        if (!ok) return null;

        return { id: 'admin', name: 'Juan M.', email: 'admin@gstock.local' };
      },
    }),
  ],
});
