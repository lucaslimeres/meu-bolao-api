import { z } from 'zod';

export const createPredictionSchema = z.object({
  groupId: z.uuid("ID do grupo inválido"),
  matchId: z.coerce.number().positive(),
  homeGuess: z.number().min(0, "Gols não podem ser negativos"),
  awayGuess: z.number().min(0, "Gols não podem ser negativos"),
});
