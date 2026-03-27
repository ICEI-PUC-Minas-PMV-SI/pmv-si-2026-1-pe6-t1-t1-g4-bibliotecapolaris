import { prisma } from '@/lib/prisma';
import type { CreateBookInput, UpdateBookInput } from '@/models/BookModel';
import { generateSlug } from '@/utils';

function normalizeCategories(categories: string[]): string {
  const normalized = categories
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean)
    .join(',');

  return `${normalized}`;
}

export async function createBook(data: CreateBookInput) {
  const baseSlug = generateSlug(data.name);
  let slug = baseSlug;
  let count = 1;

  while (await prisma.book.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  const { availableQuantity, ...rest } = data;

  return prisma.book.create({
    data: {
      ...rest,
      totalAvailable: availableQuantity, // Mapeado conforme schema.prisma
      categories: normalizeCategories(data.categories),
      slug,
    },
    include: {
      author: true,
    },
  });
}

export async function getBookById(id: string) {
  return prisma.book.findUniqueOrThrow({
    where: { id },
    include: {
      author: true,
      reviews: {
        include: {
          loan: {
            include: {
              student: {
                select: { id: true, name: true, slug: true },
              },
            },
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
      reviews: {
        include: {
          loan: {
            include: {
              student: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function listBooks(filters?: { 
  name?: string; 
  authorName?: string; 
  categories?: string;
  wishlistId?: string;
}) {
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
      ...(filters?.wishlistId && {
        wishlists: {
          some: {
            id: filters.wishlistId // Filtro via nova entidade intermediária
          }
        }
      }),
    },
    include: {
      author: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function updateBook(id: string, data: UpdateBookInput) {
  await prisma.book.findUniqueOrThrow({ where: { id } });

  const updatedData: any = { ...data };

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

export async function deleteBook(id: string) {
  return prisma.book.delete({
    where: { id },
  });
}
