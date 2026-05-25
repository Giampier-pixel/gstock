import { ArrowDownRight, ArrowUpRight, Package, AlertTriangle, ShoppingCart, Wallet, ArrowLeftRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { apiFetch } from '@/lib/api/client';
import type { DashboardKpis, RevenuePoint } from '@/lib/api/types';
import { Sparkline } from './sparkline';

const PEN = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 });

export async function KpiCards() {
  let kpis: DashboardKpis = {
    totalSkus: 0,
    lowStockCount: 0,
    ordersToday: 0,
    movementsToday: { in: 0, out: 0 },
    inventoryValue: 0,
  };
  let revenue: RevenuePoint[] = [];
  try {
    [kpis, revenue] = await Promise.all([
      apiFetch<DashboardKpis>('/v1/dashboard/kpis'),
      apiFetch<RevenuePoint[]>('/v1/reports/revenue?days=7'),
    ]);
  } catch {
    // keep zeros + empty series on transient API errors; page still renders
  }

  const revenueSeries = revenue.map((r) => r.revenue);
  const unitsOutSeries = revenue.map((r) => r.unitsOut);
  const movementsTotal = kpis.movementsToday.in + kpis.movementsToday.out;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 relative z-10">
      <KpiCard
        label="SKUs totales"
        value={kpis.totalSkus.toLocaleString('es-PE')}
        icon={<Package size={16} />}
        accentClass="text-foreground"
      />

      <KpiCard
        label="Stock bajo"
        value={kpis.lowStockCount.toString()}
        icon={<AlertTriangle size={16} />}
        accentClass="text-[#e74c3c]"
        tone={kpis.lowStockCount > 0 ? 'alert' : undefined}
      />

      <KpiCard
        label="Órdenes hoy"
        value={kpis.ordersToday.toString()}
        icon={<ShoppingCart size={16} />}
        accentClass="text-emerald-600"
        sparkline={
          revenueSeries.length > 1 ? (
            <Sparkline data={revenueSeries} color="#10b981" gradientId="spark-orders" />
          ) : null
        }
      />

      <KpiCard
        label="Valor inventario"
        value={PEN.format(kpis.inventoryValue)}
        icon={<Wallet size={16} />}
        accentClass="text-foreground"
        valueSizeClass="text-[24px]"
      />

      <KpiCard
        label="Movimientos hoy"
        value={movementsTotal.toString()}
        icon={<ArrowLeftRight size={16} />}
        accentClass="text-primary"
        footer={
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <ArrowDownRight size={12} /> {kpis.movementsToday.in} in
            </span>
            <span className="inline-flex items-center gap-1 text-[#e74c3c]">
              <ArrowUpRight size={12} /> {kpis.movementsToday.out} out
            </span>
          </div>
        }
        sparkline={
          unitsOutSeries.length > 1 ? (
            <Sparkline data={unitsOutSeries} color="#4F46E5" gradientId="spark-mov" />
          ) : null
        }
      />
    </div>
  );
}

type KpiCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  accentClass?: string;
  valueSizeClass?: string;
  tone?: 'alert';
  sparkline?: React.ReactNode;
  footer?: React.ReactNode;
};

function KpiCard({ label, value, icon, accentClass = 'text-foreground', valueSizeClass = 'text-[32px]', tone, sparkline, footer }: KpiCardProps) {
  return (
    <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-5 shadow-sm border-white/60 h-[140px] overflow-hidden flex flex-col justify-between group transition-transform hover:-translate-y-0.5">
      <div className={`absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent ${tone === 'alert' ? 'via-[#e74c3c]/30' : 'via-primary/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10 flex items-start justify-between">
        <h3 className="text-muted-foreground text-[11px] font-semibold uppercase tracking-widest leading-tight">{label}</h3>
        <span className="text-muted-foreground/70">{icon}</span>
      </div>
      <div className="relative z-10">
        <p className={`${valueSizeClass} font-semibold ${accentClass} leading-none tracking-tight`}>{value}</p>
        {footer ? <div className="mt-2">{footer}</div> : null}
      </div>
      {sparkline ? <div className="relative z-10 -mx-1">{sparkline}</div> : null}
    </Card>
  );
}
