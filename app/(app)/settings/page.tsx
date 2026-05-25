import { auth } from '@/lib/auth';
import { apiFetch } from '@/lib/api/client';
import type { ApiUser } from '@/lib/api/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { ProfileForm } from '@/components/features/settings/profile-form';
import { PasswordForm } from '@/components/features/settings/password-form';
import { PreferencesCard } from '@/components/features/settings/preferences-card';

export const metadata = { title: 'Ajustes — gstock' };

export default async function SettingsPage() {
  const session = await auth();
  const sessionName = session?.user?.name ?? 'Usuario';
  const sessionEmail = session?.user?.email ?? '';

  let me: ApiUser | null = null;
  try {
    me = await apiFetch<ApiUser>('/v1/auth/me');
  } catch {
    // Fallback to session values if the API is unreachable.
  }

  const name = me?.name ?? sessionName;
  const email = me?.email ?? sessionEmail;
  const emailNotifications = me?.emailNotifications ?? true;
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <PageHeader title="Ajustes" subtitle={'Configuración\ndel sistema'} />

      <div className="flex-1 relative z-10 flex flex-col gap-6 w-full max-w-3xl pb-8">
        <Card className="bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perfil del Usuario</h2>
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-[#485381] text-white font-bold text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-foreground font-medium text-lg">{name}</h3>
              <p className="text-muted-foreground text-sm">Administrador Principal</p>
            </div>
          </div>
          <ProfileForm name={name} email={email} />
        </Card>

        <Card className="bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60">
          <h2 className="text-lg font-semibold text-foreground mb-1">Seguridad</h2>
          <p className="text-muted-foreground text-xs mb-4">
            Cambia tu contraseña. Tu sesión actual seguirá activa hasta cerrarla.
          </p>
          <PasswordForm />
        </Card>

        <Card className="bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60">
          <h2 className="text-lg font-semibold text-foreground mb-4">Preferencias</h2>
          <PreferencesCard initial={{ emailNotifications }} />
        </Card>
      </div>
    </>
  );
}
