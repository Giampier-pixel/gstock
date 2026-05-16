'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import * as store from '@/lib/store/products';
import { productCreateSchema, productUpdateSchema } from '@/lib/store/types';

export type ActionState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function requireSession() {
  const session = await auth();
  if (!session) return { error: 'No autorizado' } as ActionState;
  return null;
}

export async function createProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await requireSession();
  if (denied) return denied;

  const parsed = productCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  store.createProduct(parsed.data);
  revalidatePath('/products');
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function updateProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await requireSession();
  if (denied) return denied;

  const parsed = productUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const { id, ...patch } = parsed.data;
  const result = store.updateProduct(id, patch);
  if (!result) return { error: 'Producto no encontrado' };

  revalidatePath('/products');
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function deleteProductAction(id: string): Promise<ActionState> {
  const denied = await requireSession();
  if (denied) return denied;

  const ok = store.deleteProduct(id);
  if (!ok) return { error: 'Producto no encontrado' };

  revalidatePath('/products');
  revalidatePath('/dashboard');
  return { ok: true };
}
