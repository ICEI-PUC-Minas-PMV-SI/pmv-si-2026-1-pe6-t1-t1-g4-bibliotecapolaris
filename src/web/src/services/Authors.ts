import type { Author } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getAuthors(): Promise<Author[]> {
  const res = await fetch(`${API_URL}/author`, {
    cache: 'no-store',
  });

  const data = await res.json();
  return data.data ?? [];
}

export async function createAuthor(name: string): Promise<Author> {
  const res = await fetch(`${API_URL}/author`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? `Erro ${res.status}`);
  }

  return data.data;
}
