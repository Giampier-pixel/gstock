import { PageHeader } from '@/components/layout/page-header';
import { MovementsTable } from '@/components/features/movements/movements-table';
import { MovementFormDialog } from '@/components/features/movements/movement-form-dialog';

export const metadata = { title: 'Movimientos — gstock' };

export default function MovementsPage() {
  return (
    <>
      <PageHeader
        title="Movimientos"
        subtitle={'Historial de\ntransacciones'}
        showAddButton
        onAddClick={<MovementFormDialog />}
      />
      <MovementsTable />
    </>
  );
}
