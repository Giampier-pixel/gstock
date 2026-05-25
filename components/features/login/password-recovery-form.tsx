'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { CheckCircle2, KeyRound, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { confirmPasswordRecoveryAction, requestPasswordRecoveryAction } from '@/lib/actions/password-recovery';

export function PasswordRecoveryForm() {
  const [requestState, requestAction, requestPending] = useActionState(requestPasswordRecoveryAction, undefined);
  const [confirmState, confirmAction, confirmPending] = useActionState(confirmPasswordRecoveryAction, undefined);
  const email = requestState?.ok ? requestState.email ?? '' : confirmState?.email ?? '';
  const step: 'email' | 'code' | 'done' = confirmState?.ok ? 'done' : requestState?.ok ? 'code' : 'email';

  return (
    <div className="z-10 w-full max-w-[460px] rounded-[28px] border border-white/10 bg-card/70 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-sm">
          {step === 'done' ? <CheckCircle2 size={22} /> : <KeyRound size={22} />}
        </div>
        <h1 className="text-[28px] font-bold text-foreground">Recuperar contraseña</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === 'email' ? 'Ingresa tu correo para recibir un código.' : step === 'code' ? 'Escribe el código recibido y tu nueva contraseña.' : 'Tu contraseña fue actualizada.'}
        </p>
      </div>

      {step === 'email' && (
        <form action={requestAction} className="space-y-4">
          <div className="space-y-1.5">
            <div className="relative">
              <Input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                autoComplete="email"
                className="h-[50px] rounded-xl border-primary/30 bg-white/5 pl-5 pr-12 text-[15px] shadow-inner focus-visible:border-primary focus-visible:ring-primary/30"
                aria-invalid={!!requestState?.fieldErrors?.email?.[0]}
                required
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            </div>
            {requestState?.fieldErrors?.email?.[0] && <p className="text-xs font-medium text-destructive">{requestState.fieldErrors.email[0]}</p>}
          </div>
          {requestState?.error && <p className="text-sm font-medium text-destructive">{requestState.error}</p>}
          <Button
            type="submit"
            disabled={requestPending}
            className="h-[50px] w-full rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg"
          >
            {requestPending ? 'Enviando...' : 'Enviar código'}
          </Button>
        </form>
      )}

      {step === 'code' && (
        <form action={confirmAction} className="space-y-4">
          <input type="hidden" name="email" value={email} />
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-foreground">{email}</div>
          <RecoveryField label="Código" name="code" error={confirmState?.fieldErrors?.code?.[0]} />
          <RecoveryField label="Nueva contraseña" name="password" type="password" error={confirmState?.fieldErrors?.password?.[0]} />
          <RecoveryField label="Confirmar contraseña" name="confirmPassword" type="password" error={confirmState?.fieldErrors?.confirmPassword?.[0]} />
          {confirmState?.error && <p className="text-sm font-medium text-destructive">{confirmState.error}</p>}
          <Button
            type="submit"
            disabled={confirmPending}
            className="h-[50px] w-full rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg"
          >
            {confirmPending ? 'Actualizando...' : 'Cambiar contraseña'}
          </Button>
        </form>
      )}

      {step === 'done' && (
        <Link
          href="/login"
          className="inline-flex h-[50px] w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-[15px] font-semibold text-white shadow-lg transition-all hover:from-primary/90 hover:to-primary/70"
        >
          Volver al login
        </Link>
      )}

      {step !== 'done' && (
        <div className="mt-5 text-center">
          <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Volver al login
          </Link>
        </div>
      )}
    </div>
  );
}

function RecoveryField({ label, name, type = 'text', error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Input
        name={name}
        type={type}
        placeholder={label}
        className="h-[46px] rounded-xl border-primary/30 bg-white/5 px-4 text-[15px] shadow-inner focus-visible:border-primary focus-visible:ring-primary/30"
        aria-invalid={!!error}
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
