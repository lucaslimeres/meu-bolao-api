import { z } from 'zod';

export const createChampionshipSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const finishChampionshipParams = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});