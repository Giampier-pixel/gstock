'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateProfileAction } from '@/lib/actions/account';
import type { ActionState } from '@/lib/actions/products';

const initial: ActionState = {};

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initial);

  useEffect(() => {
    if (state.ok) toast.success('Perfil actualizado');
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="profile-name"
            className="text-xs font-semibold uppercase text-muted-foreground tracking-wider"
          >
            Nombre Completo
          </Label>
          <Input
            id="profile-name"
            name="name"
            defaultValue={name}
            className="bg-white/5 border-white/10 text-sm h-10"
          />
          {state.fieldErrors?.name?.[0] && (
            <p className="text-destructive text-xs">{state.fieldErrors.name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="profile-email"
            className="text-xs font-semibold uppercase text-muted-foreground tracking-wider"
          >
            Correo Electrónico
          </Label>
          <Input
            id="profile-email"
            name="email"
            type="email"
            defaultValue={email}
            className="bg-white/5 border-white/10 text-sm h-10"
          />
          {state.fieldErrors?.email?.[0] && (
            <p className="text-destructive text-xs">{state.fieldErrors.email[0]}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground h-10 px-6 shadow-md border-none"
        >
          {pending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}
