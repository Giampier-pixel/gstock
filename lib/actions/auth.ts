'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';

export async function signInAction(_prev: { error?: string } | undefined, formData: FormData) {
  try {
    await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirectTo: '/dashboard',
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: 'Usuario o contraseña incorrectos' };
    }
    throw err;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: '/login' });
}
