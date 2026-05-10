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

// --- OPERAÇÃO 1: CRIAÇÃO ---
export async function createBook(data: CreateBookInput) {
  const baseSlug = generateSlug(data.name);
  let slug = baseSlug;
  let count = 1;

  while (await prisma.book.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  return prisma.book.create({
    data: {
      ...data,
      imageSrc: data.imageSrc ?? '',
      categories: normalizeCategories(data.categories),
      slug,
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

export async function listBooks(filters?: { search?: string }) {
  const cleanSearch = filters?.search?.trim();

  return prisma.book.findMany({
    where: filters?.search
      ? {
          OR: [
            {
              name: {
                contains: cleanSearch,
              },
            },
            {
              author: {
                is: {
                  name: {
                    contains: cleanSearch,
                  },
                },
              },
            },
            {
              categories: {
                contains: cleanSearch,
              },
            },
          ],
        }
      : undefined,
    include: {
      author: true,
    },
    orderBy: { name: 'asc' },
  });
}

// --- OPERAÇÃO 3: ATUALIZAÇÃO ---
export async function updateBook(id: string, data: UpdateBookInput) {
  await prisma.book.findUniqueOrThrow({ where: { id } });

  const updatedData: Record<string, unknown> = { ...data };

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

  if (typeof data.totalAvailable !== 'undefined') {
    updatedData.totalAvailable = data.totalAvailable;
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

export async function listCategories() {
  const books = await prisma.book.findMany({
    select: {
      categories: true,
      imageSrc: true,
    },
  });

  const categoryMap = new Map<string, string>();

  books.forEach((book) => {
    const categories = book.categories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    for (const cat of categories) {
      const normalizedCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();

      if (!categoryMap.has(normalizedCat)) {
        categoryMap.set(normalizedCat, book.imageSrc || '/assets/images/mock-book.png');

        break;
      }
    }
  });

  return Array.from(categoryMap.entries()).map(([name, imageSrc]) => ({
    name,
    imageSrc,
  }));
}
