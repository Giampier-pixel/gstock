'use client';

import { useActionState, useEffect, useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createProductAction, updateProductAction, type ActionState } from '@/lib/actions/products';
import type { Product } from '@/lib/api/types';

const initial: ActionState = {};

export function ProductFormDialog({ product, trigger }: { product?: Product; trigger?: React.ReactElement }) {
  const editingProduct = product;
  const isEdit = !!editingProduct;
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateProductAction : createProductAction,
    initial,
  );

  useEffect(() => {
    if (state.ok) {
      toast.success(isEdit ? 'Producto actualizado' : 'Producto creado');
      queueMicrotask(() => setOpen(false));
    }
  }, [state, isEdit]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="h-9 px-4 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] transition-all font-medium text-sm flex items-center gap-2">
              <Plus size={16} />
              Agregar
            </Button>
          )
        }
      />
      <DialogContent className="bg-card/95 backdrop-blur-xl border border-white/60 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}
          <div className="grid grid-cols-2 gap-3">
            {editingProduct ? (
              <ReadonlyField label="SKU" value={editingProduct.sku} />
            ) : (
              <Field label="SKU" name="sku" error={state.fieldErrors?.sku?.[0]} />
            )}
            <Field label="Categoría" name="category" defaultValue={product?.category} error={state.fieldErrors?.category?.[0]} />
          </div>
          <Field label="Nombre" name="name" defaultValue={product?.name} error={state.fieldErrors?.name?.[0]} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio (PEN)" name="price" type="number" min={0} step={1} defaultValue={product?.price} error={state.fieldErrors?.price?.[0]} />
            <Field label="Costo (PEN)" name="cost" type="number" min={0} step={1} defaultValue={product?.cost} error={state.fieldErrors?.cost?.[0]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stock" name="stock" type="number" min={1} step={1} defaultValue={product?.stock?.toString()} error={state.fieldErrors?.stock?.[0]} />
            <Field label="Stock mínimo" name="minStock" type="number" min={0} step={1} defaultValue={product?.minStock?.toString()} error={state.fieldErrors?.minStock?.[0]} />
          </div>
          {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11 px-5 text-[15px]">Cancelar</Button>
            <Button type="submit" disabled={pending} className="h-11 px-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[15px]">
              {pending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditProductButton({ product }: { product: Product }) {
  return (
    <ProductFormDialog
      product={product}
      trigger={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg">
          <Edit2 size={16} />
        </Button>
      }
    />
  );
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  error,
  min,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string;
  min?: number;
  step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        min={min}
        step={step}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        className="h-11 border-primary/40 bg-background/80 shadow-sm focus-visible:border-primary focus-visible:ring-primary/30"
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{label}</Label>
      <div className="flex h-11 items-center rounded-lg border border-primary/35 bg-muted/50 px-2.5 text-sm font-medium text-muted-foreground shadow-sm">
        {value}
      </div>
    </div>
  );
}
