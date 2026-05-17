const API_BASE = process.env.API_URL ?? 'https://gstock-api.vercel.app';

export interface ApiLoginResponse {
  accessToken: string;
  user: { id: string; username: string; name: string; email: string; role: string };
}

export async function apiLogin(username: string, password: string): Promise<ApiLoginResponse | null> {
  const res = await fetch(`${API_BASE}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return (await res.json()) as ApiLoginResponse;
}
