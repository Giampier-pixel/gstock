import { PageHeader } from '@/components/layout/page-header';
import { ProvidersTable } from '@/components/features/providers/providers-table';
import { ProviderFormDialog } from '@/components/features/providers/provider-form-dialog';

export const metadata = { title: 'Proveedores — gstock' };

export default function ProvidersPage() {
  return (
    <>
      <PageHeader
        title="Proveedores"
        subtitle={'Directorio de\nproveedores'}
        showFilters
        showAddButton
        onAddClick={<ProviderFormDialog />}
      />
      <ProvidersTable />
    </>
  );
}
