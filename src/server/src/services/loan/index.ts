import type { z } from 'zod';

import { LoanCreateSchema, LoanUpdateSchema } from './schema';

import { prisma } from '@/lib/prisma';
import { LoanStatus } from '@prisma/client';

type LoanCreateInput = z.infer<typeof LoanCreateSchema>;
type LoanUpdateInput = z.infer<typeof LoanUpdateSchema>;

const loanIncludes = {
  student: true,
  book: { include: { author: true } },
} as const;

export async function getAllLoans() {
  return prisma.loan.findMany({ include: loanIncludes });
}

export async function getLoanById(id: string) {
  return prisma.loan.findUniqueOrThrow({
    where: { id },
    include: loanIncludes,
  });
}

export async function createLoan(data: LoanCreateInput) {
  return prisma.$transaction(async (tx) => {
    const loan = await tx.loan.create({
      data: {
        ...data,
        loanDate: data.loanDate,
        dueDate: data.dueDate,
        returnDate: null,
      },
      include: { book: true },
    });

    await tx.book.update({
      where: { id: data.bookId },
      data: { totalAvailable: { decrement: 1 } },
    });

    return loan;
  });
}

export async function updateLoan(id: string, data: LoanUpdateInput) {
  const { ...updateData }: any = data;

  if (data.loanDate) updateData.loanDate = data.loanDate;
  if (data.dueDate) updateData.dueDate = data.dueDate;
  if (data.returnDate) updateData.returnDate = data.returnDate;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.loan.findUnique({ where: { id } });

    const updated = await tx.loan.update({
      where: { id },
      data: updateData,
      include: { student: true },
    });

    // Ao devolver, incrementa disponibilidade
    if (data.status === 'returned' && existing?.status !== 'returned') {
      await tx.book.update({
        where: { id: existing!.bookId },
        data: { totalAvailable: { increment: 1 } },
      });
    }

    return updated;
  });
}

export async function deleteLoan(id: string) {
  return prisma.loan.delete({ where: { id } });
}

export async function getLoansByStudent(studentId: string) {
  return prisma.loan.findMany({
    where: { studentId },
    include: loanIncludes,
  });
}

export async function getLoansByStatus(status: LoanStatus) {
  return prisma.loan.findMany({
    where: { status },
    include: loanIncludes,
  });
}

export async function markOverdueLoans() {
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return prisma.loan.updateMany({
    where: {
      status: 'in_progress',
      dueDate: { lt: today },
    },
    data: { status: 'overdue' },
  });
}
