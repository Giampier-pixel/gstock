'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { apiFetch, ApiError } from '@/lib/api/client';
import type { Movement, MovementType } from '@/lib/api/types';
import type { ActionState } from './products';

function handleApiError(err: unknown): ActionState {
  if (err instanceof ApiError) {
    return { error: err.problem.detail ?? err.problem.title, fieldErrors: err.problem.errors };
  }
  return { error: 'Error de red. Reintentá.' };
}

export async function createMovementAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };

  const productId = formData.get('productId')?.toString().trim();
  const type = formData.get('type')?.toString().trim() as MovementType | undefined;
  const quantityRaw = formData.get('quantity')?.toString().trim();
  const reason = formData.get('reason')?.toString().trim() || undefined;

  const errors: Record<string, string[]> = {};
  if (!productId) errors.productId = ['Seleccioná un producto'];
  if (type !== 'IN' && type !== 'OUT') errors.type = ['Tipo inválido'];
  const quantity = quantityRaw ? Number(quantityRaw) : NaN;
  if (!Number.isInteger(quantity) || quantity < 1) errors.quantity = ['Cantidad inválida'];
  if (Object.keys(errors).length) return { fieldErrors: errors };

  try {
    await apiFetch<Movement>('/v1/movements', {
      method: 'POST',
      body: { productId, type, quantity, reason },
    });
    revalidatePath('/movements');
    revalidatePath('/dashboard');
    revalidatePath('/products');
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deleteMovementAction(id: string): Promise<ActionState> {
  const session = await auth();
  if (!session) return { error: 'No autorizado' };

  try {
    await apiFetch<void>(`/v1/movements/${id}`, { method: 'DELETE' });
    revalidatePath('/movements');
    revalidatePath('/dashboard');
    revalidatePath('/products');
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}
