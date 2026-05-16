import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listMovements } from '@/lib/store/movements';

export function MovementsTable() {
  const movements = listMovements();

  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-xl border border-white/60 overflow-hidden shadow-[0_4px_20px_rgba(82,92,141,0.05)] flex-1 relative z-10 flex flex-col">
      <Table className="w-full text-left max-h-min border-none">
        <TableHeader className="bg-gradient-to-r from-primary to-primary/90">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-primary-foreground px-6 py-[14px] font-medium text-xs tracking-wider w-[70px] text-center h-auto">#</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">FECHA</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">TIPO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">PRODUCTO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto text-right">CANTIDAD</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">USUARIO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((item) => (
            <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors text-sm last:border-0 group">
              <TableCell className="px-6 py-[14px] font-medium text-foreground text-center">{item.id}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.date}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.type === 'Entrada' ? 'bg-emerald-500' : item.type === 'Salida' ? 'bg-[#e74c3c]' : 'bg-amber-500'}`} />
                  {item.type}
                </div>
              </TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.product}</TableCell>
              <TableCell className={`px-4 py-[14px] font-medium text-right ${item.quantity > 0 ? 'text-emerald-500' : item.quantity < 0 ? 'text-[#e74c3c]' : 'text-foreground'}`}>
                {item.quantity > 0 ? '+' : ''}{item.quantity}
              </TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-muted-foreground">{item.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
