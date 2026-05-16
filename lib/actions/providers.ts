'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import * as store from '@/lib/store/providers';
import { providerCreateSchema, providerUpdateSchema } from '@/lib/store/types';
import type { ActionState } from './products';

export async function createProviderAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };

  const parsed = providerCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  store.createProvider(parsed.data);
  revalidatePath('/providers');
  return { ok: true };
}

export async function updateProviderAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };

  const parsed = providerUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const { id, ...patch } = parsed.data;
  const result = store.updateProvider(id, patch);
  if (!result) return { error: 'Proveedor no encontrado' };

  revalidatePath('/providers');
  return { ok: true };
}

export async function deleteProviderAction(id: string): Promise<ActionState> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };
  const ok = store.deleteProvider(id);
  if (!ok) return { error: 'Proveedor no encontrado' };
  revalidatePath('/providers');
  return { ok: true };
}
