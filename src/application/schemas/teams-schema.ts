import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string(),
  badgeUrl: z.url('URL inválida'),
  championshipId: z.number(),
});

export const listTeamSchema = z.object({
  championshipId: z.number(),
});