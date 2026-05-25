'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2 border-t bg-background p-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Pregunta sobre el inventario…"
        rows={1}
        className="max-h-32 min-h-9 resize-none text-sm"
        disabled={disabled}
        maxLength={2000}
      />
      <Button type="submit" size="icon" disabled={disabled || !value.trim()}>
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
}
