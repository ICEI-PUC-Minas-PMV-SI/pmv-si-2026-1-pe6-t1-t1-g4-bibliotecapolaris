import { prisma } from '@/lib/prisma';

export type CreateAuthorInput = {
  name: string;
};

export async function createAuthor(data: CreateAuthorInput) {
  return prisma.author.create({
    data,
  });
}

export async function getAllAuthors() {
  return prisma.author.findMany({});
}

export async function getAuthorById(id: string) {
  return prisma.author.findUniqueOrThrow({
    where: { id },
    include: {
      books: true,
    },
  });
}

export async function updateAuthor(id: string, data: Partial<CreateAuthorInput>) {
  return prisma.author.update({
    where: { id },
    data,
  });
}

export async function getBooksByAuthorId(authorId: string) {
  return prisma.book.findMany({
    where: { authorId },
  });
}

export async function deleteAuthor(id: string) {
  return prisma.author.delete({
    where: { id },
  });
}
