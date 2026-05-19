'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { apiFetch, ApiError } from '@/lib/api/client';
import type { ApiUser } from '@/lib/api/types';
import type { ActionState } from '@/lib/actions/products';

async function requireSession(): Promise<ActionState | null> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };
  return null;
}

function handleApiError(err: unknown): ActionState {
  if (err instanceof ApiError) {
    return { error: err.problem.detail ?? err.problem.title, fieldErrors: err.problem.errors };
  }
  return { error: 'Error de red. Reintentá.' };
}

interface ProfileFormBody {
  name?: string;
  email?: string;
}

function emailIsValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireSession();
  if (denied) return denied;

  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();

  const fieldErrors: Record<string, string[]> = {};
  const body: ProfileFormBody = {};

  if (name !== undefined) {
    if (!name) fieldErrors.name = ['El nombre es obligatorio'];
    else if (name.length > 120) fieldErrors.name = ['Máximo 120 caracteres'];
    else body.name = name;
  }
  if (email !== undefined) {
    if (!email) fieldErrors.email = ['El correo es obligatorio'];
    else if (!emailIsValid(email)) fieldErrors.email = ['Correo inválido'];
    else body.email = email;
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  if (!body.name && !body.email) return { error: 'No hay cambios para guardar' };

  try {
    await apiFetch<ApiUser>('/v1/auth/me', { method: 'PATCH', body });
    revalidatePath('/settings');
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireSession();
  if (denied) return denied;

  const currentPassword = formData.get('currentPassword')?.toString() ?? '';
  const newPassword = formData.get('newPassword')?.toString() ?? '';
  const confirmPassword = formData.get('confirmPassword')?.toString() ?? '';

  const fieldErrors: Record<string, string[]> = {};
  if (!currentPassword) fieldErrors.currentPassword = ['La contraseña actual es obligatoria'];
  if (!newPassword) fieldErrors.newPassword = ['La nueva contraseña es obligatoria'];
  else if (newPassword.length < 8) fieldErrors.newPassword = ['Mínimo 8 caracteres'];
  if (newPassword !== confirmPassword) {
    fieldErrors.confirmPassword = ['Las contraseñas no coinciden'];
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  try {
    await apiFetch<void>('/v1/auth/me/password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    });
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function updatePreferencesAction(input: {
  emailNotifications?: boolean;
  darkMode?: boolean;
}): Promise<ActionState> {
  const denied = await requireSession();
  if (denied) return denied;

  const body: { emailNotifications?: boolean; darkMode?: boolean } = {};
  if (typeof input.emailNotifications === 'boolean') {
    body.emailNotifications = input.emailNotifications;
  }
  if (typeof input.darkMode === 'boolean') body.darkMode = input.darkMode;
  if (Object.keys(body).length === 0) return { error: 'Nada para actualizar' };

  try {
    await apiFetch<ApiUser>('/v1/auth/me/preferences', { method: 'PATCH', body });
    revalidatePath('/settings');
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}
