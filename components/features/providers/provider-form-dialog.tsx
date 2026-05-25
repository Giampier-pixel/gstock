'use client';

import { useActionState, useEffect, useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createProviderAction, updateProviderAction } from '@/lib/actions/providers';
import type { ActionState } from '@/lib/actions/products';
import type { Provider } from '@/lib/api/types';

const initial: ActionState = {};

export function ProviderFormDialog({ provider, trigger }: { provider?: Provider; trigger?: React.ReactElement }) {
  const isEdit = !!provider;
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateProviderAction : createProviderAction,
    initial,
  );

  useEffect(() => {
    if (state.ok) {
      toast.success(isEdit ? 'Proveedor actualizado' : 'Proveedor creado');
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
          <DialogTitle>{isEdit ? 'Editar proveedor' : 'Nuevo proveedor'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {isEdit && <input type="hidden" name="id" value={provider!.id} />}
          <Field label="Nombre"   name="name"    defaultValue={provider?.name}             error={state.fieldErrors?.name?.[0]} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email"    name="email"   type="email" defaultValue={provider?.email ?? ''}   error={state.fieldErrors?.email?.[0]} />
            <Field label="Teléfono" name="phone"                 defaultValue={provider?.phone ?? ''}   error={state.fieldErrors?.phone?.[0]} />
          </div>
          <Field label="Dirección" name="address" defaultValue={provider?.address ?? ''}   error={state.fieldErrors?.address?.[0]} />
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

export function EditProviderButton({ provider }: { provider: Provider }) {
  return (
    <ProviderFormDialog
      provider={provider}
      trigger={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg">
          <Edit2 size={16} />
        </Button>
      }
    />
  );
}

function Field({ label, name, type = 'text', defaultValue, error }: { label: string; name: string; type?: string; defaultValue?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        className="h-11 border-primary/40 bg-background/80 shadow-sm focus-visible:border-primary focus-visible:ring-primary/30"
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
