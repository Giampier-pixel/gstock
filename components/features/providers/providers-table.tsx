import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiFetch } from '@/lib/api/client';
import type { Paginated, Provider } from '@/lib/api/types';
import { TablePagination } from '@/components/ui/table-pagination';
import { EditProviderButton } from './provider-form-dialog';
import { DeleteProviderButton } from './delete-provider-button';

export async function ProvidersTable({ page: currentPage = 1 }: { page?: number }) {
  let providers: Provider[] = [];
  let totalPages = 1;
  let page = currentPage;
  let errorMsg: string | null = null;
  try {
    const response = await apiFetch<Paginated<Provider>>(`/v1/providers?page=${currentPage}&pageSize=10`);
    providers = response.data;
    page = response.meta.page;
    totalPages = response.meta.totalPages;
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : 'No se pudo cargar';
  }

  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-xl border border-white/60 overflow-hidden shadow-[0_4px_20px_rgba(82,92,141,0.05)] flex-1 relative z-10 flex flex-col">
      {errorMsg && (
        <div className="p-4 text-sm text-destructive border-b border-destructive/20 bg-destructive/5">
          Error: {errorMsg}
        </div>
      )}
      <Table className="w-full text-left max-h-min border-none">
        <TableHeader className="bg-gradient-to-r from-primary to-primary/90">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-primary-foreground px-6 py-[14px] font-medium text-xs tracking-wider h-auto">PROVEEDOR</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">EMAIL</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">TELÉFONO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">DIRECCIÓN</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider w-[100px] text-right h-auto">ACCIONES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.length === 0 && !errorMsg && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin proveedores.</TableCell>
            </TableRow>
          )}
          {providers.map((item) => (
            <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors text-sm last:border-0 group">
              <TableCell className="px-6 py-[14px] font-medium text-foreground">{item.name}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.email ?? '—'}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.phone ?? '—'}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-muted-foreground">{item.address ?? '—'}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-right">
                <div className="flex items-center justify-end gap-1">
                  <EditProviderButton provider={item} />
                  <DeleteProviderButton id={item.id} name={item.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination basePath="/providers" page={page} totalPages={totalPages} />
    </div>
  );
}
