'use client';

import { useEffect, useRef } from 'react';
import { MessageCircle, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInput } from './chat-input';
import { MessageBubble } from './message-bubble';
import { useChatStream } from './use-chat-stream';

interface Props {
  onClose: () => void;
}

export function ChatPanel({ onClose }: Props) {
  const { messages, pending, error, send, reset } = useChatStream();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="fixed bottom-20 right-4 z-50 flex h-[36rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">gstock Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={reset}
            title="Limpiar conversación"
            disabled={pending || messages.length === 0}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose} title="Cerrar">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div ref={scrollerRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
        {messages.length === 0 && (
          <div className="px-2 py-6 text-center text-xs text-muted-foreground">
            Pregúntame sobre productos, stock, movimientos o KPIs.
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}
      </div>

      <ChatInput onSend={send} disabled={pending} />
    </div>
  );
}
