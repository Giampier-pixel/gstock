import { ArrowRightLeft, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { RevenueAreaChart } from '@/components/features/reports/revenue-area-chart';
import { CategoryBarChart } from '@/components/features/reports/category-bar-chart';
import { apiFetch } from '@/lib/api/client';
import type { CategoryBreakdown, RevenuePoint } from '@/lib/api/types';

export const metadata = { title: 'Reportes — gstock' };

export default async function ReportsPage() {
  let revenue: RevenuePoint[] = [];
  let categories: CategoryBreakdown[] = [];
  try {
    [revenue, categories] = await Promise.all([
      apiFetch<RevenuePoint[]>('/v1/reports/revenue?days=14'),
      apiFetch<CategoryBreakdown[]>('/v1/reports/categories'),
    ]);
  } catch {
    // Fall through; charts render empty.
  }

  const revenueChartData = revenue.map((r) => ({
    name: new Date(r.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
    ingresos: r.revenue,
    egresos: 0,
  }));

  const categoryChartData = categories.map((c) => ({ name: c.category, value: c.stockUnits }));

  return (
    <>
      <PageHeader title="Reportes" subtitle={'Análisis y\nrendimiento'} />

      <div className="grid grid-cols-2 gap-6 flex-1 min-h-[400px] relative z-10 mb-8">
        <Card className="col-span-2 relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 overflow-hidden flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">Ingresos por venta</h3>
              <p className="text-muted-foreground text-xs mt-1">Últimos 14 días</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs border-primary/20 bg-card/50 hover:bg-card shadow-sm transition-all text-foreground">Exportar CSV</Button>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <RevenueAreaChart data={revenueChartData} />
          </div>
        </Card>

        <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 overflow-hidden flex flex-col">
          <div className="mb-6">
            <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">Stock por Categoría</h3>
          </div>
          <div className="flex-1 min-h-[180px] w-full">
            <CategoryBarChart data={categoryChartData} />
          </div>
        </Card>

        <Card className="relative bg-card/60 backdrop-blur-xl rounded-xl p-6 shadow-sm border-white/60 overflow-hidden flex flex-col">
          <div className="mb-6">
            <h3 className="text-foreground text-[11px] font-semibold uppercase tracking-widest leading-[1.2]">Rendimiento</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="w-full flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Categorías activas</p>
                <p className="text-2xl font-bold text-emerald-500 tracking-tight">{categories.length}</p>
              </div>
              <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="w-full flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Unidades vendidas (14d)</p>
                <p className="text-2xl font-bold text-primary tracking-tight">{revenue.reduce((acc, r) => acc + r.unitsOut, 0)}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ArrowRightLeft size={24} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
