'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Package2, ArrowRightLeft, Users2, FileText, Settings, LogOut, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/lib/actions/auth';

const items = [
  { href: '/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/products',   label: 'Productos',   icon: Package2 },
  { href: '/movements',  label: 'Movimientos', icon: ArrowRightLeft },
  { href: '/providers',  label: 'Proveedores', icon: Users2 },
  { href: '/reports',    label: 'Reportes',    icon: FileText },
  { href: '/settings',   label: 'Ajustes',     icon: Settings },
] as const;

export function Sidebar({ userName, userInitials }: { userName: string; userInitials: string }) {
  const pathname = usePathname();
  const [pending, setPending] = useState<string | null>(null);

  // When real navigation finishes, clear the pending hint
  useEffect(() => {
    queueMicrotask(() => setPending(null));
  }, [pathname]);

  const effective = pending ?? pathname;

  return (
    <aside className="w-[260px] bg-gradient-to-b from-sidebar/90 to-sidebar-accent/90 backdrop-blur-3xl text-sidebar-foreground flex flex-col h-full py-10 px-6 z-10 shadow-[4px_0_24px_rgba(82,92,141,0.15)] relative">
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-[38px] h-[38px] bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/5 shadow-sm rounded-xl flex items-center justify-center">
          <Package2 size={20} className="text-white" />
        </div>
        <span className="text-white text-[19px] font-semibold tracking-wide">gstock</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5 mt-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = effective === href || effective.startsWith(href + '/');
          const isPending = pending === href && pathname !== href;
          return (
            <Link
              key={href}
              href={href}
              prefetch
              onClick={() => {
                if (href !== pathname) setPending(href);
              }}
              className={`group rounded-lg py-2.5 px-4 flex items-center gap-3 transition-all duration-150 ease-out ${
                active
                  ? 'bg-gradient-to-r from-primary-foreground/15 to-primary-foreground/5 shadow-sm'
                  : 'hover:bg-white/[0.08] hover:translate-x-0.5 text-muted-foreground hover:text-white'
              }`}
            >
              <Icon size={18} className={`transition-colors ${active ? 'text-white' : ''}`} />
              <span className={`flex-1 font-medium text-[15px] transition-colors ${active ? 'text-white' : ''}`}>{label}</span>
              {isPending && <Loader2 size={14} className="text-white/70 animate-spin" />}
            </Link>
          );
        })}
      </nav>

      <form action={signOutAction} className="mt-8 bg-gradient-to-r from-[#444E7B] to-[#363D60] hover:from-[#495484] hover:to-[#384167] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.1)] border border-white/5 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#485381] text-white font-bold text-sm">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{userName}</span>
            <span className="text-white/70 text-xs">Admin</span>
          </div>
        </div>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </Button>
      </form>
    </aside>
  );
}
