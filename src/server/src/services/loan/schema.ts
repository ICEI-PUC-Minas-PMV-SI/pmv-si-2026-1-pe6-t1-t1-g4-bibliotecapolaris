import { z } from 'zod';

export const LoanCreateSchema = z.object({
  studentId: z.uuid(),
  bookId: z.uuid(),
  loanDate: z.string(),
  dueDate: z.string(),
  status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']),
});

export const LoanUpdateSchema = LoanCreateSchema.partial().extend({
  status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']),
  returnDate: z.string().optional(),
});

export const LoanSchema = z.object({
  id: z.uuid(),
  studentId: z.uuid(),
  bookId: z.uuid(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().optional(),
  status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']),
});

export const LoanWithUserSchema = LoanSchema.extend({
  student: z
    .object({
      id: z.uuid(),
      name: z.string(),
      email: z.string().email(),
    })
    .optional(),
});
