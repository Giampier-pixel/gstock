'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { apiFetch, ApiError } from '@/lib/api/client';
import type { Product } from '@/lib/api/types';

export type ActionState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

interface ProductFormBody {
  sku?: string;
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  cost?: number;
  stock?: number;
  minStock?: number;
  providerId?: string;
}

function parseFormData(formData: FormData): { id?: string; body: ProductFormBody; errors?: Record<string, string[]> } {
  const id = formData.get('id')?.toString() || undefined;
  const body: ProductFormBody = {};
  const errors: Record<string, string[]> = {};

  const sku = formData.get('sku')?.toString().trim();
  const name = formData.get('name')?.toString().trim();
  const category = formData.get('category')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const priceRaw = formData.get('price')?.toString().trim();
  const costRaw = formData.get('cost')?.toString().trim();
  const stockRaw = formData.get('stock')?.toString().trim();
  const minStockRaw = formData.get('minStock')?.toString().trim();
  const providerId = formData.get('providerId')?.toString().trim();

  if (sku) body.sku = sku;
  if (name) body.name = name;
  if (category) body.category = category;
  if (description) body.description = description;
  if (providerId) body.providerId = providerId;

  if (priceRaw !== undefined && priceRaw !== '') {
    const n = Number(priceRaw);
    if (Number.isFinite(n) && n >= 0) body.price = Math.round(n);
    else errors.price = ['Precio inválido'];
  }
  if (costRaw !== undefined && costRaw !== '') {
    const n = Number(costRaw);
    if (Number.isFinite(n) && n >= 0) body.cost = Math.round(n);
    else errors.cost = ['Costo inválido'];
  }
  if (stockRaw !== undefined && stockRaw !== '') {
    const n = Number(stockRaw);
    if (Number.isInteger(n) && n >= 1) body.stock = n;
    else errors.stock = ['El stock no puede ser menor a 1'];
  }
  if (minStockRaw !== undefined && minStockRaw !== '') {
    const n = Number(minStockRaw);
    if (Number.isInteger(n) && n >= 0) body.minStock = n;
    else errors.minStock = ['Stock mínimo inválido'];
  }

  if (!id) {
    if (!body.sku) errors.sku = ['El SKU es obligatorio'];
    if (!body.name) errors.name = ['El nombre es obligatorio'];
    if (!body.category) errors.category = ['La categoría es obligatoria'];
    if (body.price === undefined) errors.price = ['El precio es obligatorio'];
    if (body.cost === undefined) errors.cost = ['El costo es obligatorio'];
  }

  return { id, body, errors: Object.keys(errors).length ? errors : undefined };
}

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

export async function createProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await requireSession();
  if (denied) return denied;

  const { body, errors } = parseFormData(formData);
  if (errors) return { fieldErrors: errors };

  try {
    await apiFetch<Product>('/v1/products', { method: 'POST', body });
    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function updateProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await requireSession();
  if (denied) return denied;

  const { id, body, errors } = parseFormData(formData);
  if (!id) return { error: 'Falta el id' };
  if (errors) return { fieldErrors: errors };

  try {
    await apiFetch<Product>(`/v1/products/${id}`, { method: 'PATCH', body });
    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deleteProductAction(id: string): Promise<ActionState> {
  const denied = await requireSession();
  if (denied) return denied;

  try {
    await apiFetch<void>(`/v1/products/${id}`, { method: 'DELETE' });
    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { ok: true };
  } catch (err) {
    return handleApiError(err);
  }
}
