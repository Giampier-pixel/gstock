'use server';

import type { ProblemDetails } from '@/lib/api/types';

const API_BASE = process.env.API_URL ?? 'https://gstock-api.vercel.app';
const REQUEST_RESET_PATH = process.env.PASSWORD_RESET_REQUEST_PATH ?? '/v1/auth/password-reset/request';
const CONFIRM_RESET_PATH = process.env.PASSWORD_RESET_CONFIRM_PATH ?? '/v1/auth/password-reset/confirm';

export type PasswordRecoveryState = {
  ok?: boolean;
  error?: string;
  email?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function emailIsValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function publicApiFetch(path: string, body: unknown): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (res.ok) return;

  const text = await res.text();
  const problem = text
    ? (JSON.parse(text) as ProblemDetails)
    : {
        type: 'about:blank',
        title: res.statusText,
        status: res.status,
      };
  throw problem;
}

function handleProblem(err: unknown): PasswordRecoveryState {
  const problem = err as ProblemDetails;
  if (problem?.status) {
    return {
      error: problem.detail ?? problem.title,
      fieldErrors: problem.errors,
    };
  }
  return { error: 'Error de red. Reintentá.' };
}

export async function requestPasswordRecoveryAction(
  _prev: PasswordRecoveryState | undefined,
  formData: FormData,
): Promise<PasswordRecoveryState> {
  const email = formData.get('email')?.toString().trim().toLowerCase() ?? '';
  if (!email) return { fieldErrors: { email: ['El correo es obligatorio'] } };
  if (!emailIsValid(email)) return { fieldErrors: { email: ['Correo inválido'] } };

  try {
    await publicApiFetch(REQUEST_RESET_PATH, { email });
    return { ok: true, email };
  } catch (err) {
    return handleProblem(err);
  }
}

export async function confirmPasswordRecoveryAction(
  _prev: PasswordRecoveryState | undefined,
  formData: FormData,
): Promise<PasswordRecoveryState> {
  const email = formData.get('email')?.toString().trim().toLowerCase() ?? '';
  const code = formData.get('code')?.toString().trim() ?? '';
  const password = formData.get('password')?.toString() ?? '';
  const confirmPassword = formData.get('confirmPassword')?.toString() ?? '';

  const fieldErrors: Record<string, string[]> = {};
  if (!email || !emailIsValid(email)) fieldErrors.email = ['Correo inválido'];
  if (!code) fieldErrors.code = ['El código es obligatorio'];
  if (!password) fieldErrors.password = ['La nueva contraseña es obligatoria'];
  else if (password.length < 8) fieldErrors.password = ['Mínimo 8 caracteres'];
  if (password !== confirmPassword) fieldErrors.confirmPassword = ['Las contraseñas no coinciden'];
  if (Object.keys(fieldErrors).length) return { fieldErrors, email };

  try {
    await publicApiFetch(CONFIRM_RESET_PATH, { email, code, password });
    return { ok: true, email };
  } catch (err) {
    return { ...handleProblem(err), email };
  }
}
