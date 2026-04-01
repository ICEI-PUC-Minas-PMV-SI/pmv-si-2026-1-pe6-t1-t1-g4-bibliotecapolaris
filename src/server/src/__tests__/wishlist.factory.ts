import { prisma } from '@/lib/prisma';

export const MOCK_AUTHOR_ID = 'ab9dfd57-242c-4d24-9806-7a84955bf83b';
export const MOCK_USER_ID = '07736286-f342-40d6-b8e8-8246071a4d4b';
export const MOCK_BOOK_ID = '4051d93a-06e8-4d8f-bf7c-627f56ba2aac';

export async function createAuthor() {
  return prisma.author.create({
    data: {
      id: MOCK_AUTHOR_ID,
      name: 'Autor Teste',
    },
  });
}

export async function createUser() {
  return prisma.user.create({
    data: {
      id: MOCK_USER_ID,
      name: 'João Teste',
      slug: `joao-teste-${Date.now()}`,
      email: `joao.${Date.now()}@unipolaris.br`,
      password: 'Senha@123',
      type: 'student',
    },
  });
}

export async function createBook(authorId: string) {
  return prisma.book.create({
    data: {
      id: MOCK_BOOK_ID,
      name: 'Clean Code',
      slug: `clean-code-${Date.now()}`,
      authorId: authorId,
      description: 'Livro top',
      categories: 'programming',
      isbn: `ISBN-${Date.now()}`,
      totalQuantity: 12,
      totalAvailable: 10,
    },
  });
}
