'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatEvent, ChatMessage } from './types';
import { clearConversation, loadConversation, saveConversation } from './chat-storage';

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const SAFE_TIMEOUT_MS = 60_000;

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages(loadConversation());
  }, []);

  useEffect(() => {
    if (messages.length > 0) saveConversation(messages);
  }, [messages]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    clearConversation();
    setMessages([]);
    setError(null);
  }, []);

  const send = useCallback(
    async (content: string) => {
      if (!content.trim() || pending) return;

      const userMsg: ChatMessage = { id: newId(), role: 'user', content, state: 'done' };
      const assistantMsg: ChatMessage = {
        id: newId(),
        role: 'model',
        content: '',
        state: 'streaming',
      };

      const nextHistory = [...messages, userMsg];
      setMessages([...nextHistory, assistantMsg]);
      setPending(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;
      const timeout = setTimeout(() => controller.abort(), SAFE_TIMEOUT_MS);

      try {
        const res = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: nextHistory.map(({ role, content }) => ({ role, content })),
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError('Sesión expirada. Vuelve a iniciar sesión.');
          } else {
            setError(`Error ${res.status}`);
          }
          setMessages((curr) =>
            curr.map((m) => (m.id === assistantMsg.id ? { ...m, state: 'error' } : m)),
          );
          return;
        }

        if (!res.body) {
          setError('Respuesta vacía del servidor.');
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let nlIndex: number;
          while ((nlIndex = buffer.indexOf('\n\n')) !== -1) {
            const rawEvent = buffer.slice(0, nlIndex).trim();
            buffer = buffer.slice(nlIndex + 2);
            if (!rawEvent.startsWith('data:')) continue;
            const json = rawEvent.replace(/^data:\s*/, '');
            let event: ChatEvent;
            try {
              event = JSON.parse(json) as ChatEvent;
            } catch {
              continue;
            }

            if (event.type === 'token') {
              setMessages((curr) =>
                curr.map((m) =>
                  m.id === assistantMsg.id ? { ...m, content: m.content + event.text } : m,
                ),
              );
            } else if (event.type === 'done') {
              setMessages((curr) =>
                curr.map((m) => (m.id === assistantMsg.id ? { ...m, state: 'done' } : m)),
              );
            } else if (event.type === 'error') {
              setError(event.message);
              setMessages((curr) =>
                curr.map((m) =>
                  m.id === assistantMsg.id
                    ? { ...m, state: 'error', content: m.content || event.message }
                    : m,
                ),
              );
            }
            // tool_call events are intentionally not surfaced in v1
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setError('La conexión se cortó por inactividad.');
        } else {
          setError((err as Error).message);
        }
        setMessages((curr) =>
          curr.map((m) => (m.id === assistantMsg.id ? { ...m, state: 'error' } : m)),
        );
      } finally {
        clearTimeout(timeout);
        setPending(false);
        abortRef.current = null;
      }
    },
    [messages, pending],
  );

  return { messages, pending, error, send, reset };
}
