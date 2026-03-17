import { z } from 'zod';

export const CreateBookSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').describe('Título do Livro'),

  authorId: z.uuid().describe('ID do Autor'),

  description: z.string().min(1, 'Descrição é obrigatória').describe('Descrição do Livro'),

  categories: z.string().min(1, 'Categoria é obrigatória').describe('Categorias do Livro'),
});

export const UpdateBookSchema = CreateBookSchema.partial().extend({
  slug: z.string().optional().describe('Slug gerado a partir do título do livro'),
});

export type CreateBookInput = z.infer<typeof CreateBookSchema>;
export type UpdateBookInput = z.infer<typeof UpdateBookSchema>;
