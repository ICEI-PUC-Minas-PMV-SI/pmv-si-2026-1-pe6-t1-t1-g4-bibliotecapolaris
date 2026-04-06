import { prisma } from '@/lib/prisma';

export const MOCK_BOOK_ID = '5051d93a-06e8-4d8f-bf7c-627f56ba2aac';
export const MOCK_AUTHOR_ID = 'bb9dfd57-242c-4d24-9806-7a84955bf83b';

export async function createTestAction() {
  const author = await prisma.author.upsert({
    where: { id: MOCK_AUTHOR_ID },
    update: {},
    create: {
      id: MOCK_AUTHOR_ID,
      name: 'Author de Teste',
    },
  });

  return author;
}

export async function createTestBook(authorId: string, overrides = {}) {
  return prisma.book.create({
    data: {
      id: MOCK_BOOK_ID,
      isbn: `TEST-ISBN-${Date.now()}`,
      name: 'Livro de Teste Jest',
      slug: `livro-teste-jest-${Date.now()}`,
      year: 2024,
      authorId,
      description: 'Uma descrição de teste para o livro.',
      categories: 'teste,jest',
      totalQuantity: 10,
      totalAvailable: 10,
      ...overrides,
    },
  });
}
