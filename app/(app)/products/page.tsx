import { PageHeader } from '@/components/layout/page-header';
import { ProductsTable } from '@/components/features/products/products-table';
import { ProductFormDialog } from '@/components/features/products/product-form-dialog';

export const metadata = { title: 'Productos — gstock' };

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Productos"
        subtitle={'Gestión de inventario\ny catálogo'}
        showFilters
        showAddButton
        onAddClick={<ProductFormDialog />}
      />
      <ProductsTable />
    </>
  );
}
