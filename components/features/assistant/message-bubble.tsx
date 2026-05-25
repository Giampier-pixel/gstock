'use client';

import { cn } from '@/lib/utils';
import type { ChatMessage } from './types';

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm shadow-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
          message.state === 'error' && 'border border-destructive/60',
        )}
      >
        {message.content || (message.state === 'streaming' ? '…' : '')}
      </div>
    </div>
  );
}
