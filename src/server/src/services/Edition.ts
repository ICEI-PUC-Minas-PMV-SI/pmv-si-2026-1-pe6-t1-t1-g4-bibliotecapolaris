import { prisma } from '@/lib/prisma';
import type { CreateEditionInput } from '@/models/EditionModel';

export async function createEdition(data: CreateEditionInput) {
  return await prisma.edition.create({
    data,
  });
}

export async function getEditionById(id: string) {
  return prisma.edition.findUniqueOrThrow({
    where: { id },
  });
}

export async function updateEdition(id: string, data: any) {
  return prisma.edition.update({
    where: { id },
    data,
  });
}

export async function deleteEdition(id: string) {
  return prisma.user.delete({
    where: {
      id,
    },
  });
}
