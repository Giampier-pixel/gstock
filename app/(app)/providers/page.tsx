import { PageHeader } from '@/components/layout/page-header';
import { ProvidersTable } from '@/components/features/providers/providers-table';
import { ProviderFormDialog } from '@/components/features/providers/provider-form-dialog';

export const metadata = { title: 'Proveedores — gstock' };

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? '1');
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function ProvidersPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const page = parsePage(params.page);

  return (
    <>
      <PageHeader
        title="Proveedores"
        subtitle={'Directorio de\nproveedores'}
        showFilters
        filterOptions={['Nombre', 'Email']}
        showAddButton
        onAddClick={<ProviderFormDialog />}
      />
      <ProvidersTable page={page} />
    </>
  );
}
