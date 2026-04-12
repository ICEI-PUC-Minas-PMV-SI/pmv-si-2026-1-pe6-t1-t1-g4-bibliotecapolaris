import type { z } from 'zod';

import { LoanCreateSchema, LoanUpdateSchema } from './schema';

import { prisma } from '@/lib/prisma';

type LoanCreateInput = z.infer<typeof LoanCreateSchema>;
type LoanUpdateInput = z.infer<typeof LoanUpdateSchema>;

export async function getAllLoans() {
  return prisma.loan.findMany({
    include: { student: true },
  });
}

export async function getLoanById(id: string) {
  return prisma.loan.findUniqueOrThrow({
    where: { id },
    include: { student: true },
  });
}

export async function createLoan(data: LoanCreateInput) {
  return prisma.loan.create({
    data: {
      ...data,
      loanDate: data.loanDate,
      dueDate: data.dueDate,
      returnDate: null,
    },
    include: { student: true },
  });
}

export async function updateLoan(id: string, data: LoanUpdateInput) {
  const { ...updateData }: any = data;

  if (data.loanDate) updateData.loanDate = data.loanDate;
  if (data.dueDate) updateData.dueDate = data.dueDate;
  if (data.returnDate) updateData.returnDate = data.returnDate;

  return prisma.loan.update({
    where: { id },
    data: updateData,
    include: { student: true },
  });
}

export async function deleteLoan(id: string) {
  return prisma.loan.delete({ where: { id } });
}

export async function getLoansByStudent(studentId: string) {
  return prisma.loan.findMany({
    where: { studentId },
    include: { student: true },
  });
}

export async function getLoansByStatus(status: 'in_progress' | 'returned' | 'canceled' | 'overdue') {
  return prisma.loan.findMany({
    where: { status },
    include: { student: true },
  });
}
