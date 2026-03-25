import { prisma } from '@/lib/prisma';
import type { AddBookToWishlistInput } from '@/models/WishlistModel';

export async function addBookToWishlist(data: AddBookToWishlistInput) {
  return prisma.wishlist.create({
    data,
    include: {
      book: true,
      student: true,
    },
  });
}

export async function getWishlistByUserId(studentId: string) {
  return prisma.wishlist.findMany({
    where: {
      studentId,
    },
    include: {
      book: true,
    },
  });
}

export async function deleteBookFromWishlist(studentId: string, bookId: string) {
  return prisma.wishlist.delete({
    where: {
      studentId_bookId: {
        studentId,
        bookId,
      },
    },
  });
}
