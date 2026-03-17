import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório').describe('Nome e Sobrenome do Usuário'),

  email: z
    .email()
    .regex(/^[a-zA-Z]+\.[a-zA-Z]+@unipolaris\.br$/, 'Use o formato nome.sobrenome@unipolaris.br')
    .describe('Email do Usuário'),

  password: z
    .string()
    .min(6, 'No mínimo 6 caracteres')
    .regex(/[A-Z]/, 'Precisa de uma letra maiúscula')
    .regex(/[!@#$%^&*]/, 'Precisa de um caractere especial'),

  type: z.enum(['student', 'administrator']).describe('Tipo de Usuário'),
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  isBlocked: z.boolean().optional().describe('Se o usuário está bloqueado'),
  lastPassword: z.string().optional().describe('Senha atual para validação antes de alterar a nova'),
  slug: z.string().optional().describe('Slug criado a partir do nome de usuário'),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
