import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listProviders } from '@/lib/store/providers';
import { EditProviderButton } from './provider-form-dialog';
import { DeleteProviderButton } from './delete-provider-button';

export function ProvidersTable() {
  const providers = listProviders();

  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-xl border border-white/60 overflow-hidden shadow-[0_4px_20px_rgba(82,92,141,0.05)] flex-1 relative z-10 flex flex-col">
      <Table className="w-full text-left max-h-min border-none">
        <TableHeader className="bg-gradient-to-r from-primary to-primary/90">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-primary-foreground px-6 py-[14px] font-medium text-xs tracking-wider w-[70px] text-center h-auto">#</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">PROVEEDOR</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">CONTACTO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">EMAIL</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto">TELÉFONO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider h-auto text-center w-[120px]">ESTADO</TableHead>
            <TableHead className="text-primary-foreground px-4 py-[14px] font-medium text-xs tracking-wider w-[100px] text-right h-auto">ACCIONES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((item) => (
            <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors text-sm last:border-0 group">
              <TableCell className="px-6 py-[14px] font-medium text-foreground text-center">{item.id}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.name}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.contact}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.email}</TableCell>
              <TableCell className="px-4 py-[14px] font-medium text-foreground">{item.phone}</TableCell>
              <TableCell className="px-4 py-[14px] text-center">
                <div className="flex justify-center">
                  <Badge className={`shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] border-none pointer-events-none rounded-md px-3 py-1 font-medium ${item.status === 'Activo' ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                    {item.status}
                  </Badge>
                </div>
              </TableCell>
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
    </div>
  );
}
