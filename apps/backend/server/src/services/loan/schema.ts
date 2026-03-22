import { z } from 'zod';

export const LoanCreateSchema = z.object({
  studentId: z.string().uuid(),
  bookId: z.string().uuid(),
  loanDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']),
});

export const LoanUpdateSchema = z.object({
  studentId: z.string().uuid().optional(),
  bookId: z.string().uuid().optional(),
  loanDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  returnDate: z.string().datetime().optional(),
  status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']).optional(),
});

export const LoanSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  bookId: z.string().uuid(),
  loanDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  returnDate: z.string().datetime().nullable(),
  status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']),
});

export const LoanWithUserSchema = LoanSchema.extend({
  student: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
  }).optional(),
});
