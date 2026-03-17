import { prisma } from '@/lib/prisma';
import type { CreateEditionInput } from '@/models/EditionModel';

export async function createEdition(data: CreateEditionInput) {
  return await prisma.edition.create({
    data,
  });
}

export async function getEditionById(id: string) {
  return prisma.edition.findUnique({
    where: { id },
  });
}

export async function updateEdition(id: string, data: any) {
  const edition = await prisma.edition.findUnique({ where: { id } });
  if (!edition) throw new Error('Edição não encontrada!');

  return prisma.edition.update({
    where: { id },
    data,
  });
}

export async function deleteEdition(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('Usuário não encontrado');

  return prisma.user.delete({
    where: {
      id,
    },
  });
}
