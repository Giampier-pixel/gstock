'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { changePasswordAction } from '@/lib/actions/account';
import type { ActionState } from '@/lib/actions/products';

const initial: ActionState = {};

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success('Contraseña actualizada');
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Field
          id="currentPassword"
          label="Contraseña actual"
          error={state.fieldErrors?.currentPassword?.[0]}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            id="newPassword"
            label="Nueva contraseña"
            error={state.fieldErrors?.newPassword?.[0]}
          />
          <Field
            id="confirmPassword"
            label="Confirmar nueva contraseña"
            error={state.fieldErrors?.confirmPassword?.[0]}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground h-10 px-6 shadow-md border-none"
        >
          {pending ? 'Actualizando…' : 'Cambiar contraseña'}
        </Button>
      </div>
    </form>
  );
}

function Field({ id, label, error }: { id: string; label: string; error?: string }) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase text-muted-foreground tracking-wider"
      >
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type="password"
        autoComplete="new-password"
        className="bg-white/5 border-white/10 text-sm h-10"
      />
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
