'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInAction } from '@/lib/actions/auth';

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-row z-10 w-full max-w-[850px] h-[500px] bg-card/60 backdrop-blur-xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden p-0">
      <div className="w-1/2 bg-gradient-to-br from-primary via-[#4f5987] to-primary/80 flex flex-col justify-center items-center text-center p-8 relative overflow-hidden rounded-r-[150px] z-10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
        <h2 className="text-[36px] font-bold text-white mb-2 tracking-tight leading-tight">¡Bienvenido!</h2>
      </div>

      <div className="w-1/2 flex flex-col justify-center px-12 py-8 relative z-0">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold text-foreground">Iniciar Sesión</h1>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                autoComplete="email"
                className="bg-white/5 border border-white/10 text-[15px] text-foreground h-[50px] pl-5 pr-12 rounded-xl placeholder:text-muted-foreground/60 w-full focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                required
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                className="bg-white/5 border border-white/10 text-[15px] text-foreground h-[50px] pl-5 pr-12 rounded-xl placeholder:text-muted-foreground/60 w-full focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                required
              />
              <Lock className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {state?.error && (
            <p className="text-destructive text-sm text-center">{state.error}</p>
          )}

          <div className="text-center mt-6 mb-4">
            <Link href="/recuperar-password" className="text-[14px] text-muted-foreground hover:text-primary transition-colors font-medium">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white h-[50px] shadow-lg border-none transition-all font-semibold tracking-wide text-[16px] mt-2 disabled:opacity-60"
          >
            {pending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
