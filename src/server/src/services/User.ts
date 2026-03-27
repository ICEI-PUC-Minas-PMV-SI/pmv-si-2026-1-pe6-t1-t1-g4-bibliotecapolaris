import { prisma } from '@/lib/prisma';
import type { CreateUserInput } from '@/models/UserModel';
import { generateSlug, hashPassword, verifyPassword } from '@/utils';

export async function createUser(data: CreateUserInput) {
  const baseSlug = generateSlug(data.name);
  let slug = baseSlug;
  let count = 1;

  while (await prisma.user.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  console.log(`[SISTEMA] Notificando administrador: Novo usuário ${data.name} cadastrado!`);

  return prisma.user.create({
    data: {
      ...data,
      slug,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id },
  });
}

export async function updateUser(id: string, data: any) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  if (data.password) {
    if (!data.lastPassword) throw new Error('É necessário informar a senha atual');
    const isValid = await verifyPassword(data.lastPassword, user.password);
    if (!isValid) throw new Error('Senha atual incorreta');

    data.password = await hashPassword(data.password);
  }

  if (data.name) {
    const baseSlug = generateSlug(data.name);
    let slug = baseSlug;
    let count = 1;

    while (await prisma.user.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    data.slug = slug;
  }

  const { lastPassword, ...prismaInput } = data;

  return prisma.user.update({
    where: { id },
    data: prismaInput,
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}
