export function formatCategories(categories?: string): string {
  if (!categories) return '';

  return categories
    .split(',')
    .map((cat) => cat.trim()) // remove espaços
    .filter(Boolean) // remove vazios
    .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1))
    .join(', ');
}

export function formatBook(book: any) {
  return {
    id: book.id,
    isbn: book.isbn,
    year: book.year,
    name: book.name,
    author: book.author?.name,
    categories: book.categories,
    description: book.description,
    totalAvailable: book.totalAvailable,
    totalQuantity: book.totalQuantity,
    imageSrc: book.imageSrc?.trim() || '/assets/images/mock-book.png',
  };
}
