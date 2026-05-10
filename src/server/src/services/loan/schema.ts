import { LoanStatus } from '@prisma/client';
import { z } from 'zod';

export const LoanCreateSchema = z.object({
  studentId: z.uuid(),
  bookId: z.uuid(),
  loanDate: z.string(),
  dueDate: z.string(),
  status: z.enum(LoanStatus),
});

export const LoanUpdateSchema = LoanCreateSchema.partial().extend({
  status: z.enum(LoanStatus),
  returnDate: z.string().optional(),

  justification: z.string().optional(),
});

export const LoanSchema = z.object({
  id: z.uuid(),
  studentId: z.uuid(),
  bookId: z.uuid(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().optional(),

  justification: z.string().nullable().optional(),

  status: z.enum(LoanStatus),
});

export const LoanWithUserSchema = LoanSchema.extend({
  student: z
    .object({
      id: z.uuid(),
      name: z.string(),
      email: z.email(),
    })
    .optional(),
});
