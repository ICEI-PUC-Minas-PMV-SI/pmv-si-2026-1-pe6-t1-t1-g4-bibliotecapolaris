import { prisma } from '@/lib/prisma';

export type CreateAuthorInput = {
  name: string;
};

export async function createAuthor(data: CreateAuthorInput) {
  return prisma.author.create({
    data,
    // Se quiser que ao criar/buscar o autor já venha a lista de livros dele,
    // basta descomentar as linhas abaixo:
    // include: {
    //   books: true,
    // },
  });
}

export async function getAllAuthors() {
  return prisma.author.findMany({
    // include: {
    //   books: true,
    // },
  });
}

export async function updateAuthor(id: string, data: Partial<CreateAuthorInput>) {
  return prisma.author.update({
    where: {
      id,
    },
    data,
  });
}

// NOVO: Buscar todos os livros de um autor específico
export async function getBooksByAuthorId(authorId: string) {
  return prisma.book.findMany({
    where: {
      authorId,
    },
    // Se quiser trazer os dados do autor junto com o livro, descomente a linha abaixo:
    // include: { author: true }
  });
}

// Bônus: Já deixei o método de deletar pronto caso precise usar depois!
export async function deleteAuthor(id: string) {
  return prisma.author.delete({
    where: {
      id,
    },
  });
}
