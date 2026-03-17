import { prisma } from '@/lib/prisma';
import type { CreateUserInput, UpdateUserInput } from '@/models/UserModel';
import { generateSlug, hashPassword, verifyPassword } from '@/utils';

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function createMockUser() {
  return prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@admin.uni.polaris',
      password: '123456',
      slug: 'usuario_teste',
      type: 'administrator',
    },
  });
}

export async function createUser(data: CreateUserInput) {
  let baseSlug = generateSlug(data.name);
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
  // findUnique procura exatamente uma linha que tenha esse ID
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
}

export async function updateUser(id: string, data: any) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('Usuário não encontrado');

  if (data.password) {
    if (!data.lastPassword) throw new Error('É necessário informar a senha atual');
    const isValid = await verifyPassword(data.lastPassword, user.password);
    if (!isValid) throw new Error('Senha atual incorreta');

    data.password = await hashPassword(data.password);
  }

  if (data.name) {
    let baseSlug = generateSlug(data.name);
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
  // O Prisma faz o trabalho sujo de achar o ID e apagar a linha da tabela
  return prisma.user.delete({
    where: {
      id: id,
    },
  });
}
