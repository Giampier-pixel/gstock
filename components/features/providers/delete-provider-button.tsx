'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { deleteProviderAction } from '@/lib/actions/providers';

export function DeleteProviderButton({ id, name }: { id: string; name: string }) {
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
      description="Esta acción no se puede deshacer. Los productos asociados conservarán su historial pero quedarán sin proveedor."
      confirmLabel="Eliminar"
      destructive
      onConfirm={async () => {
        const result = await deleteProviderAction(id);
        if (result.error) toast.error(result.error);
        else toast.success('Proveedor eliminado');
      }}
    />
  );
}
