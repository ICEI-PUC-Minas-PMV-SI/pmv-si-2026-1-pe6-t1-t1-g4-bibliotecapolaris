import { z } from 'zod';

export const AddBookToWishlistSchema = z.object({
  bookId: z.uuid().describe('ID do Livro'),
  studentId: z.uuid().describe('ID do Estudante'),
});

export type AddBookToWishlistInput = z.infer<typeof AddBookToWishlistSchema>;
