import { z } from 'zod';

export const CreateReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  loanId: z.uuid(),
  description: z.string().optional(),
  date: z.coerce.date(),
});

export const UpdateReviewSchema = CreateReviewSchema.partial();

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewSchema>;
