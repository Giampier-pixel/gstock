'use client';

import { useActionState, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createMovementAction } from '@/lib/actions/movements';
import type { ActionState } from '@/lib/actions/products';

const initial: ActionState = {};

export function MovementFormDialogClient({ products }: { products: Array<{ id: string; label: string }> }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createMovementAction, initial);

  useEffect(() => {
    if (state.ok) {
      toast.success('Movimiento registrado');
      setOpen(false);
    }
    if (state.error) toast.error(state.error);
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
            <Select name="type" defaultValue="IN">
              <SelectTrigger className="w-full bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">Entrada</SelectItem>
                <SelectItem value="OUT">Salida</SelectItem>
              </SelectContent>
            </Select>
            {state.fieldErrors?.type?.[0] && <p className="text-destructive text-xs">{state.fieldErrors.type[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Producto</Label>
            <Select name="productId" defaultValue={products[0]?.id}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 h-10"><SelectValue placeholder="Elegí un producto" /></SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.fieldErrors?.productId?.[0] && <p className="text-destructive text-xs">{state.fieldErrors.productId[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quantity" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Cantidad</Label>
            <Input id="quantity" name="quantity" type="number" min={1} className="bg-white/5 border-white/10 h-10" />
            {state.fieldErrors?.quantity?.[0] && <p className="text-destructive text-xs">{state.fieldErrors.quantity[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Motivo (opcional)</Label>
            <Input id="reason" name="reason" className="bg-white/5 border-white/10 h-10" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={pending} className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              {pending ? 'Registrando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
