export async function getBooks() {
  const res = await fetch('http://localhost:3333/api/books', {
    cache: 'no-store',
  });

  const data = await res.json();
  console.log('API RESPONSE:', data);

  return data;
}
