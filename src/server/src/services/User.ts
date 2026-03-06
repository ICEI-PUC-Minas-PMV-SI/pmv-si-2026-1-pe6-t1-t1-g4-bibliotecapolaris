import { prisma } from "@/lib/prisma";

export async function getAllUsers() {
    return prisma.user.findMany();
}

export async function createMockUser() {
  return prisma.user.create({
    data: {
      name: "John Doe",
      email: "johndoe@admin.uni.polaris",
      password: "123456",
      slug: "usuario_teste",
      type: "administrator"
    },
  });
}