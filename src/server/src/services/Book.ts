import { prisma } from '@/lib/prisma';
import type { CreateBookInput, UpdateBookInput } from '@/models/BookModel';
import { generateSlug } from '@/utils';

function normalizeCategories(categories: string): string {
  return categories
    .split(',')
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean)
    .join(',');
}

// --- OPENLIBRARY: monta URL da capa a partir do ISBN ---
// O frontend usa onError para exibir o mock quando a URL retornar 404.
function openLibraryCoverUrl(isbn: string): string {
  const clean = isbn.replace(/-/g, '').trim();
  return `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`;
}

// Para livros com imageSrc nulo ou path local (legados), computa a URL do OpenLibrary.
function resolveImageSrc(book: { isbn: string; imageSrc: string | null }): string {
  if (book.imageSrc?.startsWith('http')) return book.imageSrc;
  return openLibraryCoverUrl(book.isbn);
}

// --- OPERAÇÃO 1: CRIAÇÃO ---
export async function createBook(data: CreateBookInput) {
  const baseSlug = generateSlug(data.name);
  let slug = baseSlug;
  let count = 1;

  while (await prisma.book.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  // Armazena a URL do OpenLibrary; o frontend exibe o mock se a imagem não carregar.
  const imageSrc = openLibraryCoverUrl(data.isbn);

  const { availableQuantity, ...rest } = data;

  return prisma.book.create({
    data: {
      ...rest,
      totalAvailable: availableQuantity,
      categories: normalizeCategories(data.categories),
      slug,
      imageSrc,
    },
    include: {
      author: true,
    },
  });
}

// --- OPERAÇÃO 2: LEITURA ---
export async function getBookById(id: string) {
  const book = await prisma.book.findUniqueOrThrow({
    where: { id },
    include: {
      author: true,
      loans: {
        include: {
          reviews: true,
          student: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });
  return { ...book, imageSrc: resolveImageSrc(book) };
}

export async function getBookBySlug(slug: string) {
  const book = await prisma.book.findUniqueOrThrow({
    where: { slug },
    include: {
      author: true,
      loans: {
        include: {
          reviews: true,
          student: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });
  return { ...book, imageSrc: resolveImageSrc(book) };
}

export async function listBooks(filters?: {
  search?: string;
  name?: string;
  authorName?: string;
  categories?: string;
  wishlistId?: string;
}) {
  const { search, name, authorName, categories, wishlistId } = filters || {};

  const books = await prisma.book.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search } },
                { author: { name: { contains: search } } },
                { categories: { contains: search } },
              ],
            }
          : {},
        name ? { name: { contains: name } } : {},
        authorName ? { author: { name: { contains: authorName } } } : {},
        categories ? { categories: { contains: categories } } : {},
        wishlistId
          ? {
              wishlists: {
                some: {
                  studentId: wishlistId,
                },
              },
            }
          : {},
      ],
    },
    include: { author: true },
    orderBy: { name: 'asc' },
  });
  return books.map((book) => ({ ...book, imageSrc: resolveImageSrc(book) }));
}

// --- OPERAÇÃO 3: ATUALIZAÇÃO ---
export async function updateBook(id: string, data: UpdateBookInput) {
  const currentBook = await prisma.book.findUniqueOrThrow({ where: { id } });

  const updatedData: Record<string, unknown> = { ...data };

  // Se o ISBN mudar, refaz a URL da capa
  if (data.isbn && data.isbn !== currentBook.isbn) {
    updatedData.imageSrc = openLibraryCoverUrl(data.isbn);
  }

  if (data.name) {
    const baseSlug = generateSlug(data.name);
    let slug = baseSlug;
    let count = 1;

    // Check if new slug is needed
    const existing = await prisma.book.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      while (await prisma.book.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${count++}`;
      }
      updatedData.slug = slug;
    } else if (!existing) {
      updatedData.slug = slug;
    }
  }

  if (data.categories) {
    updatedData.categories = normalizeCategories(data.categories);
  }

  if (typeof data.availableQuantity !== 'undefined') {
    updatedData.totalAvailable = data.availableQuantity;
    delete updatedData.availableQuantity;
  }

  return prisma.book.update({
    where: { id },
    data: updatedData,
    include: {
      author: true,
    },
  });
}

// --- OPERAÇÃO 4: DELETAR ---
export async function deleteBook(id: string) {
  return prisma.book.delete({
    where: { id },
  });
}
