'use client';

import { useActionState, useEffect, useState } from 'react';
import { ChevronDown, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createMovementAction } from '@/lib/actions/movements';
import type { ActionState } from '@/lib/actions/products';

const initial: ActionState = {};
const MOVEMENT_TYPE_ITEMS = [
  { value: 'IN', label: 'Entrada' },
  { value: 'OUT', label: 'Salida' },
] as const;

export function MovementFormDialogClient({ products }: { products: Array<{ id: string; label: string }> }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createMovementAction, initial);

  useEffect(() => {
    if (state.ok) {
      toast.success('Movimiento registrado');
      queueMicrotask(() => setOpen(false));
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="h-9 px-4 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] transition-all font-medium text-sm flex items-center gap-2">
            <Plus size={16} />
            Agregar
          </Button>
        }
      />
      <DialogContent className="bg-card/95 backdrop-blur-xl border border-white/60 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar movimiento</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Tipo</Label>
            <Select name="type" defaultValue="IN" items={MOVEMENT_TYPE_ITEMS}>
              <SelectTrigger className="h-11 w-full border-primary/40 bg-background/80 shadow-sm focus-visible:border-primary focus-visible:ring-primary/30">
                <SelectValue>
                  {(value) => (value === 'OUT' ? 'Salida' : 'Entrada')}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">Entrada</SelectItem>
                <SelectItem value="OUT">Salida</SelectItem>
              </SelectContent>
            </Select>
            {state.fieldErrors?.type?.[0] && <p className="text-destructive text-xs">{state.fieldErrors.type[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Producto</Label>
            <ProductCombobox products={products} error={state.fieldErrors?.productId?.[0]} />
            {state.fieldErrors?.productId?.[0] && <p className="text-destructive text-xs">{state.fieldErrors.productId[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quantity" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Cantidad</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              className="h-11 border-primary/40 bg-background/80 shadow-sm focus-visible:border-primary focus-visible:ring-primary/30"
              aria-invalid={!!state.fieldErrors?.quantity?.[0]}
            />
            {state.fieldErrors?.quantity?.[0] && <p className="text-destructive text-xs">{state.fieldErrors.quantity[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Motivo (opcional)</Label>
            <Input id="reason" name="reason" className="h-11 border-primary/40 bg-background/80 shadow-sm focus-visible:border-primary focus-visible:ring-primary/30" />
          </div>
          {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11 px-5 text-[15px]">Cancelar</Button>
            <Button type="submit" disabled={pending} className="h-11 px-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[15px]">
              {pending ? 'Registrando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProductCombobox({
  products,
  error,
}: {
  products: Array<{ id: string; label: string }>;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<{ id: string; label: string } | null>(null);
  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? products.filter((product) => product.label.toLowerCase().includes(normalized))
    : products;

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <input type="hidden" name="productId" value={selected?.id ?? ''} />
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={selected ? selected.label : query}
          onChange={(event) => {
            setSelected(null);
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Filtrar por código o nombre"
          className="h-11 border-primary/40 bg-background/80 pl-9 pr-10 shadow-sm focus-visible:border-primary focus-visible:ring-primary/30"
          aria-expanded={open}
          aria-invalid={!!error}
          role="combobox"
        />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          aria-label="Abrir lista de productos"
        >
          <ChevronDown size={16} />
        </button>
      </div>
      {open && (
        <div className="absolute z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-lg border border-primary/25 bg-popover p-1 text-popover-foreground shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">Sin productos</div>
          ) : (
            filtered.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  setSelected(product);
                  setQuery('');
                  setOpen(false);
                }}
                className="flex w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none"
              >
                {product.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
