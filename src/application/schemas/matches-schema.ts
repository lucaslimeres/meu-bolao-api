import { z } from 'zod';

export const createMatchSchema = z.object({
  homeTeamId: z.coerce.number().positive(),
  awayTeamId: z.coerce.number().positive(),
  championshipId: z.coerce.number().positive(),
  matchDate: z.coerce.date('Data inválida'),
});

export const promoteMathSchema = z.object({
  championshipId: z.coerce.number().positive(),
});