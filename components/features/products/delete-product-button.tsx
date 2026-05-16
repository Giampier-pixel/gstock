'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { deleteProductAction } from '@/lib/actions/products';

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg disabled:opacity-50"
      disabled={pending}
      onClick={() =>
        start(async () => {
          if (!confirm(`¿Eliminar "${name}"?`)) return;
          const result = await deleteProductAction(id);
          if (result.error) toast.error(result.error);
          else toast.success('Producto eliminado');
        })
      }
    >
      <Trash2 size={16} />
    </Button>
  );
}
