import { auth } from '@/lib/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/layout/page-header';

export const metadata = { title: 'Ajustes — gstock' };

export default async function SettingsPage() {
  const session = await auth();
  const name = session?.user?.name ?? 'Usuario';
  const email = session?.user?.email ?? '';
  const initials = name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      <PageHeader title="Ajustes" subtitle={'Configuración\ndel sistema'} />

      <div className="flex-1 relative z-10 flex flex-col gap-6 w-full max-w-3xl pb-8">
        <Card className="bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perfil del Usuario</h2>
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-[#485381] text-white font-bold text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-foreground font-medium text-lg">{name}</h3>
              <p className="text-muted-foreground text-sm">Administrador Principal</p>
              <Button variant="outline" size="sm" className="mt-2 h-8 text-xs border-primary/20 bg-card/50 hover:bg-card shadow-sm transition-all text-foreground">Cambiar foto</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Nombre Completo</label>
              <Input defaultValue={name} className="bg-white/5 border-white/10 text-sm h-10" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Correo Electrónico</label>
              <Input defaultValue={email} className="bg-white/5 border-white/10 text-sm h-10" />
            </div>
          </div>
        </Card>

        <Card className="bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60">
          <h2 className="text-lg font-semibold text-foreground mb-4">Preferencias</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10 transition-colors hover:bg-white/10">
              <div>
                <h4 className="text-sm font-medium text-foreground">Notificaciones por correo</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Recibir alertas de stock bajo y movimientos.</p>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
            </div>
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10 transition-colors hover:bg-white/10">
              <div>
                <h4 className="text-sm font-medium text-foreground">Modo Oscuro</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Tema visual de la aplicación.</p>
              </div>
              <div className="w-10 h-6 bg-[hsl(var(--muted))] rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)]" /></div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" className="border-white/10 bg-transparent hover:bg-white/5 text-foreground h-10 px-6">Cancelar</Button>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground h-10 px-6 shadow-md border-none">Guardar cambios</Button>
        </div>
      </div>
    </>
  );
}
