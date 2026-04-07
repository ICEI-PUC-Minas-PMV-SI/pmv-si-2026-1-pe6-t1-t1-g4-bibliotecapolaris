import { prisma } from '@/lib/prisma';

export const MOCK_BOOK_ID = '5051d93a-06e8-4d8f-bf7c-627f56ba2aac';
export const MOCK_AUTHOR_ID = 'bb9dfd57-242c-4d24-9806-7a84955bf83b';

export async function createAuthor() {
  return prisma.author.create({
    data: {
      id: MOCK_AUTHOR_ID,
      name: 'Autor Teste',
    },
  });
}
