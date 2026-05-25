export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  state?: 'streaming' | 'done' | 'error';
}

export type ChatEvent =
  | { type: 'token'; text: string }
  | { type: 'tool_call'; names: string[] }
  | { type: 'done' }
  | { type: 'error'; message: string };
