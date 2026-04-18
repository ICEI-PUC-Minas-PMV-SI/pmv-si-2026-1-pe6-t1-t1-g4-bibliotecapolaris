export async function getBooks(search?: string) {
  const query = new URLSearchParams();

  if (search) query.append('search', search);

  const res = await fetch(`http://localhost:3333/api/books?${query.toString()}`, {
    cache: 'no-store',
  });

  const data = await res.json();

  return data.data;
}

export async function getBookBySlug(slug: string) {
  const res = await fetch(`http://localhost:3333/api/books/${slug}`, {
    cache: 'no-store',
  });

  const data = await res.json();

  return data.data;
}
