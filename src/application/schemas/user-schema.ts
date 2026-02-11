import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  email: z.email('E-mail inválido'),
  password: z.string().min(8, "Senha muito curta"),
});

export const promoteUserSchema = z.object({
  userId: z.uuid(),
  level: z.enum(['moderator', 'super_admin'], "Nível inválido"),
});

export const toggleUserStatusSchema = z.object({
  userId: z.uuid("ID de utilizador inválido"),
  isActive: z.boolean("O estado (isActive) é obrigatório"),
});