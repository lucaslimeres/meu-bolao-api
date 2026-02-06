import { z } from 'zod';

export const createMatchSchema = z.object({
  homeTeamId: z.number(),
  awayTeamId: z.number(),
  championshipId: z.number(),
  matchDate: z.date('Data inválida'),
});

export const promoteMathSchema = z.object({
  championshipId: z.number(),
});