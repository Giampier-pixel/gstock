import { seedProviders } from '../seed';
import type { Provider } from './types';

const providers = new Map<string, Provider>(seedProviders.map((p) => [p.id, p]));
let nextSeq = seedProviders.length + 1;

export function listProviders(): Provider[] {
  return Array.from(providers.values()).sort((a, b) => a.id.localeCompare(b.id));
}

export function getProvider(id: string): Provider | undefined {
  return providers.get(id);
}

export function createProvider(input: Omit<Provider, 'id'>): Provider {
  const id = `P${String(nextSeq++).padStart(3, '0')}`;
  const provider: Provider = { id, ...input };
  providers.set(id, provider);
  return provider;
}

export function updateProvider(id: string, patch: Partial<Omit<Provider, 'id'>>): Provider | undefined {
  const existing = providers.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...patch };
  providers.set(id, updated);
  return updated;
}

export function deleteProvider(id: string): boolean {
  return providers.delete(id);
}
