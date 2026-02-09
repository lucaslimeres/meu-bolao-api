import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { MatchRepository, PredictionRepository } from '@/infrastructure/database/mysql';
import { CreatePredictionUseCase } from '@/application/use-cases';
import { createPredictionSchema } from '@/application/schemas';

export class PredictionController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createPredictionSchema.parse(request.body);
      const user = request.user as { id: string };

      const predictionRepo = new PredictionRepository(db);
      const matchRepo = new MatchRepository(db);
      const useCase = new CreatePredictionUseCase(predictionRepo, matchRepo);

      const result = await useCase.execute({
        ...data,
        userId: user.id
      });

      return reply.status(201).send(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }
}