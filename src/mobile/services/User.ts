import { apiFetch, setAuthToken } from '@/util/api';

export type Student = { id: string; name: string; email: string; slug: string };

export async function loginUser(email: string, password: string) {
  const res = await apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (res.ok && data.data?.token) {
    setAuthToken(data.data.token);
  }

  return { status: res.status, data };
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await apiFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, type: 'student' }),
  });
  const data = await res.json();
  return { status: res.status, data };
}

export async function getUserBySlug(slug: string) {
  const res = await apiFetch(`/users/slug/${slug}`);
  const data = await res.json();
  return data.data;
}

export async function getStudents(): Promise<Student[]> {
  // TODO ⚠️ RESTAURAR QUANDO IMPLEMENTARMOS LOGIN — remover o comentário de auth: true abaixo
  const res = await apiFetch('/users/students', { /* auth: true */ });
  const data = await res.json();
  return (data.data ?? []) as Student[];
}
