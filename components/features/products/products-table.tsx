import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listProducts } from '@/lib/store/products';
import { EditProductButton } from './product-form-dialog';
import { DeleteProductButton } from './delete-product-button';

export function ProductsTable() {
  const products = listProducts();

  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-xl border border-white/60 overflow-hidden shadow-[0_4px_20px_rgba(82,92,141,0.05)] flex-1 relative z-10 flex flex-col">
      <Table className="w-full text-left max-h-min border-none">
        <TableHeader className="bg-gradient-to-r from-primary to-primary/90">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-primary-foreground px-6 py-[14px] font-medium text-xs tracking-wider w-[70px] text-center h-auto">#</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">PRODUCTO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">STOCK</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">CATEGORÍA</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto text-center w-[120px]">ESTADO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">VALOR</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider w-[100px] text-right h-auto">ACCIONES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item) => (
            <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors text-sm last:border-0 group">
              <TableCell className="px-6 py-[14px] font-medium text-foreground text-center">{item.id}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.name}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.stock} un.</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.category}</TableCell>
              <TableCell className="px-4 py-[14px]">
                <div className="flex justify-center">
                  <Badge className={`shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] border-none pointer-events-none rounded-md px-3 py-1 font-medium text-white ${item.stock <= 10 ? 'bg-gradient-to-r from-[#c0392b] to-[#e74c3c]' : 'bg-gradient-to-r from-primary to-primary/80'}`}>
                    {item.stock <= 10 ? 'Stock Bajo' : 'Disponible'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.value}</TableCell>
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
