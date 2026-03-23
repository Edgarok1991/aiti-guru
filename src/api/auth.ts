import { API_BASE, parseJson } from './client';
import type { LoginErrorBody, LoginResponse } from '../types';

export async function loginRequest(
  username: string,
  password: string,
  expiresInMins = 60,
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins }),
  });

  const data = await parseJson<LoginResponse & LoginErrorBody>(res);

  if (!res.ok) {
    const msg =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as LoginErrorBody).message === 'string'
        ? (data as LoginErrorBody).message
        : 'Не удалось войти';
    throw new Error(msg);
  }

  return data as LoginResponse;
}
