export type Author = {
  id: string;
  name: string;
};

export async function getAuthors(): Promise<Author[]> {
  const res = await fetch('http://127.0.0.1:3333/api/author', {
    cache: 'no-store',
  });

  const data = await res.json();
  return data.data ?? [];
}

export async function createAuthor(name: string): Promise<void> {
  const res = await fetch('http://127.0.0.1:3333/api/author', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Erro ${res.status}`);
  }
}
