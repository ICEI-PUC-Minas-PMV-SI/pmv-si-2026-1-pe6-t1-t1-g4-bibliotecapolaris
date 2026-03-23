import { prisma } from '@/lib/prisma';
import type { CreateBookInput } from '@/models/BookModel';
import { generateSlug } from '@/utils';

function normalizeCategories(categories: string): string {
  const normalized = categories
    .split(',')
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean)
    .join(',');

  return `${normalized}`;
}

export async function createBook(data: CreateBookInput) {
  let baseSlug = generateSlug(data.name);
  let slug = baseSlug;
  let count = 1;

  while (await prisma.book.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  return prisma.book.create({
    data: {
      ...data,
      categories: normalizeCategories(data.categories),
      slug,
    },
    include: {
      author: true,
      editions: true,
    },
  });
}

export async function getBookById(id: string) {
  return prisma.book.findUniqueOrThrow({
    where: { id },
    include: {
      author: true,
      editions: true,
      reviews: {
        include: {
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
      editions: true,
      reviews: {
        include: {
          student: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
  });
}

export async function listBooks(filters?: { name?: string; authorName?: string; categories?: string }) {
  return prisma.book.findMany({
    where: {
      ...(filters?.name && {
        name: { contains: filters.name },
      }),
      ...(filters?.authorName && {
        author: { name: { contains: filters.authorName } },
      }),
      ...(filters?.categories && {
        categories: { contains: `${filters.categories.toLowerCase()}` },
      }),
    },
    include: {
      author: true,
      editions: {
        select: {
          id: true,
          year: true,
          publisher: true,
          ISBN: true,
          totalQuantity: true,
          quantityAvailable: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function updateBook(id: string, data: any) {
  await prisma.book.findUniqueOrThrow({ where: { id } });

  if (data.name) {
    let baseSlug = generateSlug(data.name);
    let slug = baseSlug;
    let count = 1;

    while (await prisma.book.findUniqueOrThrow({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    (data as any).slug = slug;
  }

  return prisma.book.update({
    where: { id },
    data,
    include: {
      author: true,
      editions: true,
    },
  });
}

export async function deleteBook(id: string) {
  return prisma.book.delete({
    where: { id },
  });
}
