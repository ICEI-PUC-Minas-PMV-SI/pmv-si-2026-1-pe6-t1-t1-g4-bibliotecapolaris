import z from 'zod';

export const CreateEditionSchema = z.object({
  bookId: z.uuid().describe('ID do Livro'),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: 'Formato de Ano Inválido. Esperado YYYY.' })
    .transform((yearStr) => parseInt(yearStr, 10))
    .pipe(z.number().int().min(1900).max(2100))
    .describe('Ano de Publicação'),
  publisher: z.string().describe('Editora'),
  ISBN: z.string().describe('Código ISBN'),
  totalQuantity: z.number().int().describe('Total de Livros Cadastrados'),
  quantityAvailable: z.number().int().describe('Total Disponível para empréstimo'),
});

export const UpdateEditionSchema = CreateEditionSchema.partial();

export type CreateEditionInput = z.infer<typeof CreateEditionSchema>;
export type UpdateEditionSchema = z.infer<typeof UpdateEditionSchema>;
