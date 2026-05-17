import { apiFetch } from '@/lib/api/client';
import type { Paginated, Product } from '@/lib/api/types';
import { MovementFormDialogClient } from './movement-form-dialog-client';

export async function MovementFormDialog() {
  let options: Array<{ id: string; label: string }> = [];
  try {
    const page = await apiFetch<Paginated<Product>>('/v1/products?pageSize=100');
    options = page.data.map((p) => ({ id: p.id, label: `${p.sku} — ${p.name}` }));
  } catch {
    // ignore; client will show empty list
  }
  return <MovementFormDialogClient products={options} />;
}
