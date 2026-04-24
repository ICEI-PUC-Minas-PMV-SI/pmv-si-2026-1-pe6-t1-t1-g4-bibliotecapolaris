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

// --- INTEGRAÇÃO OPENLIBRARY: busca a capa pelo ISBN ---
async function fetchCoverFromOpenLibrary(isbn: string): Promise<string | null> {
  try {
    const cleanIsbn = isbn.replace(/-/g, '').trim();
    if (!cleanIsbn) return null;

    const url = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg?default=false`;

    console.log(`[OpenLibrary] Tentando buscar capa para ISBN: ${cleanIsbn}...`);

    // Usando GET para maior compatibilidade, mas sem baixar o corpo se possível
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // Timeout de 5 segundos
    });

    if (response.ok) {
      console.log(`[OpenLibrary] Capa encontrada com sucesso para o ISBN ${cleanIsbn}!`);
      return url;
    } else {
      console.log(`[OpenLibrary] Capa não disponível (Status ${response.status}) para o ISBN ${cleanIsbn}`);
    }
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[OpenLibrary] Erro de rede ou timeout: ${errorMessage}`);
  }
  return null;
}

// --- OPERAÇÃO 1: CRIAÇÃO ---
export async function createBook(data: CreateBookInput) {
  const baseSlug = generateSlug(data.name);
  let slug = baseSlug;
  let count = 1;

  while (await prisma.book.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  // BUSCA AUTOMÁTICA DE CAPA (OpenLibrary ou Mock)
  const imageSrc = (await fetchCoverFromOpenLibrary(data.isbn || '')) || '/assets/images/mock-book.png';

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
  return prisma.book.findUniqueOrThrow({
    where: { id },
    include: {
      author: true,
      loans: {
        include: {
          reviews: true,
          student: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
  });
}

export async function getBookBySlug(slug: string) {
  return prisma.book.findUniqueOrThrow({
    where: { slug },
    include: {
      author: true,
      loans: {
        include: {
          reviews: true,
          student: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
  });
}

export async function listBooks(filters?: {
  search?: string;
  name?: string;
  authorName?: string;
  categories?: string;
  wishlistId?: string;
}) {
  const { search, name, authorName, categories, wishlistId } = filters || {};

  return prisma.book.findMany({
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
    include: {
      author: true,
    },
    orderBy: { name: 'asc' },
  });
}

// --- OPERAÇÃO 3: ATUALIZAÇÃO ---
export async function updateBook(id: string, data: UpdateBookInput) {
  const currentBook = await prisma.book.findUniqueOrThrow({ where: { id } });

  const updatedData: Record<string, unknown> = { ...data };

  // Se o ISBN mudar, refaz a busca da capa
  if (data.isbn && data.isbn !== currentBook.isbn) {
    const newImageSrc = await fetchCoverFromOpenLibrary(data.isbn);
    updatedData.imageSrc = newImageSrc || '/assets/images/mock-book.png';
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
