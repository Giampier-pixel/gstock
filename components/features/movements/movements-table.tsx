import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiFetch } from '@/lib/api/client';
import type { Movement, Paginated } from '@/lib/api/types';
import { TablePagination } from '@/components/ui/table-pagination';

const TYPE_LABEL = { IN: 'Entrada', OUT: 'Salida' } as const;

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}

export async function MovementsTable({ page: currentPage = 1 }: { page?: number }) {
  let movements: Movement[] = [];
  let totalPages = 1;
  let page = currentPage;
  let errorMsg: string | null = null;
  try {
    const response = await apiFetch<Paginated<Movement>>(`/v1/movements?page=${currentPage}&pageSize=10`);
    movements = response.data;
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
            <TableHead className="text-primary-foreground px-6 py-[14px] font-medium text-xs tracking-wider w-[160px] text-center h-auto">FECHA</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto w-[120px]">TIPO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">PRODUCTO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto text-right w-[120px]">CANTIDAD</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">MOTIVO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.length === 0 && !errorMsg && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin movimientos.</TableCell>
            </TableRow>
          )}
          {movements.map((item) => {
            const isIn = item.type === 'IN';
            const signed = (isIn ? '+' : '−') + item.quantity;
            return (
              <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors text-sm last:border-0 group">
                <TableCell className="px-6 py-[14px] font-medium text-foreground text-center">{formatDate(item.createdAt)}</TableCell>
                <TableCell className="px-4 py-[14px] font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isIn ? 'bg-emerald-500' : 'bg-[#e74c3c]'}`} />
                    {TYPE_LABEL[item.type]}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-[14px] font-medium text-foreground">
                  {item.product?.name ?? item.productId}
                  {item.product?.sku && <span className="ml-2 font-mono text-xs text-muted-foreground">[{item.product.sku}]</span>}
                </TableCell>
                <TableCell className={`px-4 py-[14px] font-medium text-right ${isIn ? 'text-emerald-500' : 'text-[#e74c3c]'}`}>
                  {signed}
                </TableCell>
                <TableCell className="px-4 py-[14px] font-medium text-muted-foreground">{item.reason ?? '—'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination basePath="/movements" page={page} totalPages={totalPages} />
    </div>
  );
}
