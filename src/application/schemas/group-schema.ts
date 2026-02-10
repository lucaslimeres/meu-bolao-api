import { z } from 'zod';

export const createGroupSchema = z.object({
  championshipId: z.coerce.number().positive(),
  title: z.string(),
  privacyType: z.enum(['public', 'private']),
  entryDeadline: z.coerce.date('Data do campo entryDeadline inválida'),
  maxMembers: z.coerce.number().positive().min(2),
  entryFee: z.coerce.number().positive().min(0),
  hasPrize: z.coerce.boolean(),
});

export const joinGroupSchema = z.object({
  groupId: z.uuid().optional(),
  inviteCode: z.string().optional(),
}).refine(data => data.groupId || data.inviteCode, {
  message: "É necessário fornecer o ID do grupo ou o código de convite."
});

export const groupIdSchema = z.object({
  groupId: z.uuid("ID do grupo inválido")
});