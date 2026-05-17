import 'server-only';
import { auth } from '@/lib/auth';
import type { ProblemDetails } from './types';

const API_BASE = process.env.API_URL ?? 'https://gstock-api.vercel.app';

export class ApiError extends Error {
  constructor(public status: number, public problem: ProblemDetails) {
    super(problem.detail ?? problem.title);
  }
}

interface FetchOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers = {}, token, ...rest } = options;

  let accessToken = token;
  if (!accessToken) {
    const session = await auth();
    accessToken = session?.accessToken;
  }

  const finalHeaders: Record<string, string> = { ...headers };
  if (accessToken) finalHeaders.Authorization = `Bearer ${accessToken}`;
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : undefined;

  if (!res.ok) {
    const problem = (data ?? {
      type: 'about:blank',
      title: res.statusText,
      status: res.status,
    }) as ProblemDetails;
    throw new ApiError(res.status, problem);
  }

  return data as T;
}

export { apiLogin } from './login';
