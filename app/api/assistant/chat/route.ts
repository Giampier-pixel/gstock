import { auth } from '@/lib/auth';

const API_BASE = process.env.API_URL ?? 'https://gstock-api.vercel.app';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
  const session = await auth();
  const token = session?.accessToken;
  if (!token) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.text();

  const upstream = await fetch(`${API_BASE}/v1/assistant/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
    signal: request.signal,
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => '');
    return new Response(text || 'Upstream error', { status: upstream.status });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
