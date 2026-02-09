import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  email: z.email('E-mail inválido'),
  password: z.string().min(8, "Senha muito curta"),
});

export const promoteUserSchema = z.object({
  userId: z.string(),
  level: z.enum(['moderator', 'super_admin'], "Nível inválido"),
});