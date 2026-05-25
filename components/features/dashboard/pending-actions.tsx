import Link from 'next/link';
import { AlertTriangle, ArrowLeftRight, ChevronRight, PackageX } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { apiFetch } from '@/lib/api/client';
import type { DashboardKpis, Paginated, Product } from '@/lib/api/types';

export async function PendingActions() {
  let kpis: DashboardKpis = {
    totalSkus: 0,
    lowStockCount: 0,
    ordersToday: 0,
    movementsToday: { in: 0, out: 0 },
    inventoryValue: 0,
  };
  let products: Product[] = [];
  try {
    [kpis, products] = await Promise.all([
      apiFetch<DashboardKpis>('/v1/dashboard/kpis'),
      apiFetch<Paginated<Product>>('/v1/products?pageSize=100').then((p) => p.data),
    ]);
  } catch {
    // render with zeros on transient error
  }

  const inactiveCount = products.filter((p) => p.status === 'INACTIVE').length;
  const movementsTotal = kpis.movementsToday.in + kpis.movementsToday.out;

  const actions: Array<{
    key: string;
    icon: React.ReactNode;
    count: number;
    label: string;
    cta: { href: string; text: string };
    accent: string;
    bg: string;
  }> = [
    {
      key: 'low-stock',
      icon: <AlertTriangle size={18} />,
      count: kpis.lowStockCount,
      label: kpis.lowStockCount === 1 ? 'producto por reordenar' : 'productos por reordenar',
      cta: { href: '/products', text: 'Revisar' },
      accent: 'text-[#e74c3c]',
      bg: 'bg-[#e74c3c]/10',
    },
    {
      key: 'movements-today',
      icon: <ArrowLeftRight size={18} />,
      count: movementsTotal,
      label: movementsTotal === 1 ? 'movimiento registrado hoy' : 'movimientos registrados hoy',
      cta: { href: '/movements', text: 'Ver detalle' },
      accent: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      key: 'inactive',
      icon: <PackageX size={18} />,
      count: inactiveCount,
      label: inactiveCount === 1 ? 'producto inactivo' : 'productos inactivos',
      cta: { href: '/products', text: 'Gestionar' },
      accent: 'text-muted-foreground',
      bg: 'bg-muted',
    },
  ];

  return (
    <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 overflow-hidden mb-8 relative z-10">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-widest leading-tight">Acciones pendientes</h3>
          <p className="text-muted-foreground text-xs mt-1">Tareas que requieren tu atención</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((a) => (
          <Link
            key={a.key}
            href={a.cta.href}
            className="group flex items-center gap-4 rounded-xl border border-white/40 bg-white/5 p-4 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className={`h-10 w-10 rounded-full flex items-center justify-center ${a.bg} ${a.accent}`}>
              {a.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-2xl font-semibold tracking-tight ${a.accent}`}>{a.count}</p>
              <p className="text-xs text-muted-foreground truncate">{a.label}</p>
            </div>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1 group-hover:text-foreground transition-colors">
              {a.cta.text}
              <ChevronRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
