import { z } from 'zod';

const bookBase = {
  isbn: z.string().min(1, 'ISBN é obrigatório').describe('ISBN do Livro'),
  name: z.string().min(1, 'Nome é obrigatório').describe('Título do Livro'),
  year: z.number().int().positive().describe('Ano de Lançamento'),
  authorId: z.string().uuid('ID do Autor inválido').describe('ID do Autor'),
  description: z.string().min(1, 'Descrição é obrigatória').describe('Descrição do Livro'),
  totalQuantity: z.number().int().nonnegative().describe('Quantidade Total'),
};

export const CreateBookObject = z.object({
  ...bookBase,
  categories: z.string().min(1, 'Pelo menos uma categoria é obrigatória').describe('Categorias do Livro'),
  availableQuantity: z.number().int().nonnegative().describe('Quantidade Disponível'),
});

export const CreateBookSchema = CreateBookObject.refine((data) => data.availableQuantity <= data.totalQuantity, {
  message: 'A quantidade disponível não pode ser maior que a quantidade total.',
  path: ['availableQuantity'],
});

export const UpdateBookSchema = CreateBookObject.partial().extend({
  slug: z.string().optional().describe('Slug gerado a partir do título do livro'),
});

// Schema de Resposta
export const BookSchema = z.object({
  id: z.uuid().describe('ID único do livro'),
  slug: z.string().describe('URL-friendly slug do livro'),
  ...bookBase,
  categories: z.string().describe('Categorias (separadas por vírgula)'),
  totalAvailable: z.number().int().describe('Quantidade disponível para empréstimo'),
  author: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
});

export const GetBooksArray = z.object({
  books: z.array(BookSchema),
});

export type CreateBookInput = z.infer<typeof CreateBookSchema>;
export type UpdateBookInput = z.infer<typeof UpdateBookSchema>;
export type BookResponse = z.infer<typeof BookSchema>;
