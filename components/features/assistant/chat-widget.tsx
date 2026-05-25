'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatPanel } from './chat-panel';

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      <Button
        size="icon"
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat'}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
    </>
  );
}
