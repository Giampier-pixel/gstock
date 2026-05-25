'use client';

import { useState, useTransition, type ReactElement } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  trigger: ReactElement;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => Promise<unknown> | unknown;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const handleConfirm = () => {
    start(async () => {
      await onConfirm();
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="bg-primary text-primary-foreground border border-primary sm:max-w-md shadow-[0_20px_60px_-18px_rgba(42,50,86,0.65)]">
        <DialogHeader>
          <DialogTitle className="text-primary-foreground">{title}</DialogTitle>
          {description && <DialogDescription className="text-primary-foreground/85">{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="-mx-0 -mb-0 rounded-none border-t-0 bg-transparent p-0 pt-2">
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={pending} className="h-10 border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                {cancelLabel}
              </Button>
            }
          />
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className={
              destructive
                ? 'h-10 bg-destructive text-white hover:bg-destructive/90'
                : 'h-10 bg-white text-primary hover:bg-white/90'
            }
          >
            {pending ? 'Procesando…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
