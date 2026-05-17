import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiFetch } from '@/lib/api/client';
import type { Paginated, Product, ProductStatus } from '@/lib/api/types';
import { EditProductButton } from './product-form-dialog';
import { DeleteProductButton } from './delete-product-button';

const STATUS_LABEL: Record<ProductStatus, string> = {
  ACTIVE: 'Disponible',
  LOW_STOCK: 'Stock Bajo',
  INACTIVE: 'Inactivo',
};

function formatCurrency(value: string | number): string {
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(n);
}

function statusClasses(status: ProductStatus): string {
  if (status === 'LOW_STOCK') return 'bg-gradient-to-r from-[#c0392b] to-[#e74c3c]';
  if (status === 'INACTIVE') return 'bg-gradient-to-r from-muted-foreground/70 to-muted-foreground/50';
  return 'bg-gradient-to-r from-primary to-primary/80';
}

export async function ProductsTable() {
  let products: Product[] = [];
  let errorMsg: string | null = null;
  try {
    const page = await apiFetch<Paginated<Product>>('/v1/products?pageSize=100');
    products = page.data;
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
            <TableHead className="text-primary-foreground px-6 py-[14px] font-medium text-xs tracking-wider w-[110px] text-center h-auto">SKU</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">PRODUCTO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">STOCK</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">CATEGORÍA</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto text-center w-[120px]">ESTADO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">VALOR</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider w-[100px] text-right h-auto">ACCIONES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && !errorMsg && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Sin productos.</TableCell>
            </TableRow>
          )}
          {products.map((item) => (
            <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors text-sm last:border-0 group">
              <TableCell className="px-6 py-[14px] font-mono text-xs text-muted-foreground text-center">{item.sku}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.name}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.stock} un.</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.category}</TableCell>
              <TableCell className="px-4 py-[14px]">
                <div className="flex justify-center">
                  <Badge className={`shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] border-none pointer-events-none rounded-md px-3 py-1 font-medium text-white ${statusClasses(item.status)}`}>
                    {STATUS_LABEL[item.status]}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{formatCurrency(item.price)}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-right">
                <div className="flex items-center justify-end gap-1">
                  <EditProductButton product={item} />
                  <DeleteProductButton id={item.id} name={item.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
