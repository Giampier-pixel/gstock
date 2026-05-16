import { PageHeader } from '@/components/layout/page-header';
import { KpiCards } from '@/components/features/dashboard/kpi-cards';

export const metadata = { title: 'Dashboard — gstock' };

export default function DashboardPage() {
  const today = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const year = new Date().getFullYear();

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`${today}\n${year}`} />
      <KpiCards />
    </>
  );
}
