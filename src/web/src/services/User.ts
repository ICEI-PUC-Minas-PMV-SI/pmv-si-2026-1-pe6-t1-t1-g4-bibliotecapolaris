import { apiFetch } from '@/lib/api';

export const loginUser = async (email: string, password: string) => {
  const res = await apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return { status: res.status, data };
};

export const getUserBySlug = async (slug: string) => {
  const res = await apiFetch(`/users/slug/${slug}`);

  const data = await res.json();
  return data.data;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await apiFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, type: 'student' }),
  });
  const data = await res.json();
  return { status: res.status, data };
};

export const getStudents = async () => {
  const res = await apiFetch('/users/students', { auth: true });
  const data = await res.json();
  return (data.data ?? []) as { id: string; name: string; email: string; slug: string }[];
};

export const updateUserName = async (id: string, name: string) => {
  const res = await apiFetch(`/users/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  return { status: res.status, data };
};
