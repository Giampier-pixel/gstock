import { Card } from '@/components/ui/card';
import { apiFetch } from '@/lib/api/client';
import type { DashboardKpis } from '@/lib/api/types';

export async function KpiCards() {
  let kpis: DashboardKpis = {
    totalSkus: 0,
    lowStockCount: 0,
    ordersToday: 0,
    movementsToday: { in: 0, out: 0 },
    inventoryValue: 0,
  };
  try {
    kpis = await apiFetch<DashboardKpis>('/v1/dashboard/kpis');
  } catch {
    // keep zeros on transient API errors; page still renders
  }

  return (
    <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
      <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 h-[130px] overflow-hidden flex flex-col justify-between group">
        <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <h3 className="text-muted-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">SKUs<br />TOTALES</h3>
          <p className="text-[32px] font-semibold text-foreground leading-none mt-2 tracking-tight">{kpis.totalSkus.toLocaleString('es-PE')}</p>
        </div>
        <div className="relative z-10 w-full h-1 bg-muted rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full w-[45%]" />
        </div>
      </Card>

      <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 h-[130px] overflow-hidden flex flex-col justify-between group">
        <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-[#e74c3c]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <h3 className="text-muted-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">STOCK<br />BAJO</h3>
          <p className="text-[32px] font-semibold text-[#e74c3c] leading-none mt-2 tracking-tight">{kpis.lowStockCount}</p>
        </div>
        <div className="relative z-10 w-full h-1 bg-muted rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#c0392b] to-[#e74c3c] rounded-full w-[15%]" />
        </div>
      </Card>

      <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 h-[130px] overflow-hidden flex flex-col justify-between group">
        <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <h3 className="text-muted-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">ÓRDENES HOY<br />&nbsp;</h3>
          <p className="text-[32px] font-semibold text-emerald-600 leading-none mt-2 -translate-y-[14px] tracking-tight">{kpis.ordersToday}</p>
        </div>
        <div className="relative z-10 w-full h-1 bg-muted rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full w-[60%]" />
        </div>
      </Card>
    </div>
  );
}
