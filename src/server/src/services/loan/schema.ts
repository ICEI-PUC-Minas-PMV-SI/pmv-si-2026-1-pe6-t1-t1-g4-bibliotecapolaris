import { z } from 'zod';

export const LoanCreateSchema = z.object({
  studentId: z.uuid(),
  bookId: z.uuid(),
  loanDate: z.date(),
  dueDate: z.date(),
  status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']),
});

export const LoanUpdateSchema = z.object({
  studentId: z.uuid().optional(),
  bookId: z.uuid().optional(),
  loanDate: z.date().optional(),
  dueDate: z.date().optional(),
  returnDate: z.date().optional(),
  status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']).optional(),
});

export const LoanSchema = z.object({
  id: z.uuid(),
  studentId: z.uuid(),
  bookId: z.uuid(),
  loanDate: z.date(),
  dueDate: z.date(),
  returnDate: z.date().nullable(),
  status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']),
});

export const LoanWithUserSchema = LoanSchema.extend({
  student: z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.string().email(),
  }).optional(),
});
