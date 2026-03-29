import { z } from 'zod';

export const CreateAuthorSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome é obrigatório e precisa ter pelo menos 3 caracteres')
    .describe('Nome do Autor'),
});

export const UpdateAuthorSchema = CreateAuthorSchema.partial();

export type CreateAuthorInput = z.infer<typeof CreateAuthorSchema>;
export type UpdateAuthorInput = z.infer<typeof UpdateAuthorSchema>;
