export async function getBooks(search?: string) {
  const query = new URLSearchParams();

  if (search) query.append('search', search);

  const res = await fetch(`http://127.0.0.1:3333/api/books?${query.toString()}`, {
    cache: 'no-store',
  });

  const data = await res.json();

  return data.data;
}

export async function getBookBySlug(slug: string) {
  const res = await fetch(`http://127.0.0.1:3333/api/books/${slug}`, {
    cache: 'no-store',
  });

  const data = await res.json();

  return data.data;
}

export async function createBook(payload: {
  isbn: string;
  name: string;
  authorId: string;
  categories: string;
  description: string;
  year: number;
  totalQuantity: number;
  availableQuantity: number;
}) {
  const res = await fetch('http://127.0.0.1:3333/api/books/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Erro ${res.status}`);
  }

  const data = await res.json();
  return data.data;
}

export async function deleteBook(id: string) {
  const res = await fetch(`http://127.0.0.1:3333/api/books/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Erro ao deletar livro ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  return data;
}
