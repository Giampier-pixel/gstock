import { PageHeader } from '@/components/layout/page-header';
import { MovementsTable } from '@/components/features/movements/movements-table';
import { MovementFormDialog } from '@/components/features/movements/movement-form-dialog';

export const metadata = { title: 'Movimientos — gstock' };

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? '1');
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function MovementsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const page = parsePage(params.page);

  return (
    <>
      <PageHeader
        title="Movimientos"
        subtitle={'Historial de\ntransacciones'}
        showAddButton
        onAddClick={<MovementFormDialog />}
      />
      <MovementsTable page={page} />
    </>
  );
}
