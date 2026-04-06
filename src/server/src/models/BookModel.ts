import { z } from 'zod';

export const CreateBookSchema = z
  .object({
    isbn: z.string().min(1, 'ISBN é obrigatório').describe('ISBN do Livro'),
    name: z.string().min(1, 'Nome é obrigatório').describe('Título do Livro'),
    year: z.number().int().positive().describe('Ano de Lançamento'),
    authorId: z.string().uuid('ID do Autor inválido').describe('ID do Autor'),
    description: z.string().min(1, 'Descrição é obrigatória').describe('Descrição do Livro'),
    categories: z.array(z.string()).min(1, 'Pelo menos uma categoria é obrigatória').describe('Categorias do Livro'),
    totalQuantity: z.number().int().nonnegative().describe('Quantidade Total'),
    availableQuantity: z.number().int().nonnegative().describe('Quantidade Disponível'),
  })
  .refine((data) => data.availableQuantity <= data.totalQuantity, {
    message: 'A quantidade disponível não pode ser maior que a quantidade total.',
    path: ['availableQuantity'],
  });

export const UpdateBookSchema = CreateBookSchema.partial().extend({
  slug: z.string().optional().describe('Slug gerado a partir do título do livro'),
});

export const GetBooksArray = z.object({
  books: z.array(CreateBookSchema),
});

export type CreateBookInput = z.infer<typeof CreateBookSchema>;
export type UpdateBookInput = z.infer<typeof UpdateBookSchema>;
