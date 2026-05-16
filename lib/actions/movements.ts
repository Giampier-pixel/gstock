'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import * as store from '@/lib/store/movements';
import { movementCreateSchema } from '@/lib/store/types';
import type { ActionState } from './products';

export async function createMovementAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };

  const parsed = movementCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  store.createMovement({
    ...parsed.data,
    user: session.user?.name ?? 'Sistema',
  });
  revalidatePath('/movements');
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function deleteMovementAction(id: string): Promise<ActionState> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };
  const ok = store.deleteMovement(id);
  if (!ok) return { error: 'Movimiento no encontrado' };
  revalidatePath('/movements');
  revalidatePath('/dashboard');
  return { ok: true };
}
