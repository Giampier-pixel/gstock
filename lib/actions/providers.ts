'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { apiFetch, ApiError } from '@/lib/api/client';
import type { Provider } from '@/lib/api/types';
import type { ActionState } from './products';

interface ProviderBody {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

function parseFormData(formData: FormData): { id?: string; body: ProviderBody; errors?: Record<string, string[]> } {
  const id = formData.get('id')?.toString() || undefined;
  const body: ProviderBody = {};
  const errors: Record<string, string[]> = {};

  const name = formData.get('name')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const address = formData.get('address')?.toString().trim();

  if (name) body.name = name;
  if (phone) body.phone = phone;
  if (email) body.email = email;
  if (address) body.address = address;

  if (!id && !body.name) errors.name = ['El nombre es obligatorio'];

  return { id, body, errors: Object.keys(errors).length ? errors : undefined };
}

function handleApiError(err: unknown): ActionState {
  if (err instanceof ApiError) {
    return { error: err.problem.detail ?? err.problem.title, fieldErrors: err.problem.errors };
  }
  return { error: 'Error de red. Reintentá.' };
}

export async function createProviderAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };

  const { body, errors } = parseFormData(formData);
  if (errors) return { fieldErrors: errors };

  try {
    await apiFetch<Provider>('/v1/providers', { method: 'POST', body });
    revalidatePath('/providers');
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function updateProviderAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };

  const { id, body, errors } = parseFormData(formData);
  if (!id) return { error: 'Falta el id' };
  if (errors) return { fieldErrors: errors };

  try {
    await apiFetch<Provider>(`/v1/providers/${id}`, { method: 'PATCH', body });
    revalidatePath('/providers');
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deleteProviderAction(id: string): Promise<ActionState> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };

  try {
    await apiFetch<void>(`/v1/providers/${id}`, { method: 'DELETE' });
    revalidatePath('/providers');
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}
