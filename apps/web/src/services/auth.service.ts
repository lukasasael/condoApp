import api from './api';

export interface LoginPayload { email: string; password: string; }
export interface AuthUser { id: string; nome: string; role: string; condominioId: string; }

export async function login(payload: LoginPayload): Promise<{ access_token: string; user: AuthUser }> {
  const res = await api.post('/auth/login', payload);
  return res.data;
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(token: string, user: AuthUser) {
  localStorage.setItem('access_token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  localStorage.clear();
  window.location.href = '/login';
}
