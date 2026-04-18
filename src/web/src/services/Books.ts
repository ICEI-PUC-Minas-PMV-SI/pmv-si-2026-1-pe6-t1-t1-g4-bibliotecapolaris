export async function getBooks(search?: string) {
  const query = new URLSearchParams();

  if (search) query.append('search', search);

  const res = await fetch(`http://localhost:3333/api/books?${query.toString()}`, { cache: 'no-store' });

  return res.json();
}
