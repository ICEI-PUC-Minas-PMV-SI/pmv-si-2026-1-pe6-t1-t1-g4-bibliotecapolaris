import { prisma } from '@/lib/prisma';

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

// Precisamos avisar ao TypeScript quais dados vamos receber
interface CreateUserData {
  name: string;
  email: string;
  password: string;
  type: 'student' | 'administrator';
}

export async function createUser(data: CreateUserData) {
  // Criamos o slug automaticamente tirando os espaços do nome
  const slug = data.name.toLowerCase().replace(/\s+/g, '-');

  console.log(`[SISTEMA] Notificando administrador: Novo usuário ${data.name} cadastrado!`);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password, // criptografar isso depois!
      type: data.type,
      slug: slug,
    },
  });
}

export async function getUserById(id: string) {
  // findUnique procura exatamente uma linha que tenha esse ID
  return prisma.user.findUnique({
    where: { 
      id: id 
    },
  });
}

// A interface continua igual
interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  type?: 'student' | 'administrator';
  isBlocked?: boolean;
}

export async function updateUser(id: string, data: UpdateUserData) {
  // 1. Criamos um objeto "caixa vazia" para colocar só o que vai mudar
  const dadosParaAtualizar: any = {};

  // 2. Só colocamos na caixa aquilo que realmente veio na requisição
  if (data.name) {
    dadosParaAtualizar.name = data.name;
    dadosParaAtualizar.slug = data.name.toLowerCase().replace(/\s+/g, '-');
  }
  
  if (data.email) {
    dadosParaAtualizar.email = data.email;
  }
  
  if (data.password) {
    dadosParaAtualizar.password = data.password;
  }
  
  if (data.type) {
    dadosParaAtualizar.type = data.type;
  }
  
  // Como o boolean pode ser "false", a checagem é um pouco diferente
  if (data.isBlocked !== undefined) {
    dadosParaAtualizar.isBlocked = data.isBlocked;
  }

  // 3. Mandamos a caixa "limpinha" pro Prisma, sem nenhum undefined
  return prisma.user.update({
    where: { 
      id: id 
    },
    data: dadosParaAtualizar,
  });
}

export async function deleteUser(id: string) {
  // O Prisma faz o trabalho sujo de achar o ID e apagar a linha da tabela
  return prisma.user.delete({
    where: { 
      id: id 
    },
  });
}