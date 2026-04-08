import { z } from 'zod';

export const CreateAuthorSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome é obrigatório e precisa ter pelo menos 3 caracteres')
    .refine((name) => /^[A-Za-zÀ-ÿ\s]+$/.test(name), {
      message: 'O nome não pode conter números ou caracteres especiais',
    })
    .describe('Nome do Autor'),
});

export const UpdateAuthorSchema = CreateAuthorSchema.partial().extend({
  id: z.string().uuid().describe('ID do Autor'),
});

export type CreateAuthorInput = z.infer<typeof CreateAuthorSchema>;
export type UpdateAuthorInput = z.infer<typeof UpdateAuthorSchema>;
