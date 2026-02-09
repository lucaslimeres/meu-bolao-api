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

export const updateMatchResultSchema = z.object({
  matchId: z.coerce.number().positive(),
  homeScore: z.number().min(0, "Gols não podem ser negativos"),
  awayScore: z.number().min(0, "Gols não podem ser negativos"),
});