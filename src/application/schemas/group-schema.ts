import { z } from 'zod';

export const createGroupSchema = z.object({
  championshipId: z.number(),
  title: z.string(),
  privacyType: z.enum(['public', 'private']),
  entryDeadline: z.coerce.date('Data do campo entryDeadline inválida'),
  maxMembers: z.number().min(2),
  entryFee: z.number().min(0),
  hasPrize: z.boolean(),
});