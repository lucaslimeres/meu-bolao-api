import { z } from 'zod';

export const createChampionshipSchema = z.object({
  title: z.string(),
  description: z.string(),
});