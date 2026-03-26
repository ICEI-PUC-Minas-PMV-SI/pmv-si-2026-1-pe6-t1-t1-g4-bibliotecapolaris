import { z } from 'zod';

export const CreateReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  loanId: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;