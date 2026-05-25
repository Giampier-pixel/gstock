import { PageHeader } from '@/components/layout/page-header';
import { ProductsTable } from '@/components/features/products/products-table';
import { ProductFormDialog } from '@/components/features/products/product-form-dialog';

export const metadata = { title: 'Productos — gstock' };

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? '1');
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const page = parsePage(params.page);

  return (
    <>
      <PageHeader
        title="Productos"
        subtitle={'Gestión de inventario\ny catálogo'}
        showFilters
        filterOptions={['Categoría', 'Estado']}
        showAddButton
        onAddClick={<ProductFormDialog />}
      />
      <ProductsTable page={page} />
    </>
  );
}
