'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { deleteProductAction } from '@/lib/actions/products';

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
          aria-label={`Eliminar ${name}`}
        >
          <Trash2 size={16} />
        </Button>
      }
      title={`Eliminar "${name}"`}
      description="Esta acción no se puede deshacer. El producto y sus movimientos asociados se eliminarán."
      confirmLabel="Eliminar"
      destructive
      onConfirm={async () => {
        const result = await deleteProductAction(id);
        if (result.error) toast.error(result.error);
        else toast.success('Producto eliminado');
      }}
    />
  );
}
