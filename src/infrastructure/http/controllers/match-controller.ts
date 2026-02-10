import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { MatchRepository, PredictionRepository } from '@/infrastructure/database/mysql';
import { CreateMatchUseCase, UpdateMatchResultUseCase } from '@/application/use-cases';
import { createMatchSchema, listTeamSchema, updateMatchResultSchema } from '@/application/schemas';

export class MatchController {
  async createMatch(request: FastifyRequest, reply: FastifyReply) {
    const matchRepository = new MatchRepository(db);
    const useCase = new CreateMatchUseCase(matchRepository);

    try {
      const validatedData = createMatchSchema.parse(request.body);
  
      const data = validatedData;
      const match = await useCase.execute(data);
      return reply.status(201).send(match);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async listMatches(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedData = listTeamSchema.parse(request.params);

      const { championshipId } = validatedData;

      const matchRepository = new MatchRepository(db);
      const list = await matchRepository.listByChampionship(Number(championshipId));
      return reply.status(200).send(list);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const requestValidation = { ...request.body as object, ...request.params as object };
      const data = updateMatchResultSchema.parse(requestValidation);

      const predictionRepo = new PredictionRepository(db);
      const matchRepo = new MatchRepository(db);
      const useCase = new UpdateMatchResultUseCase(matchRepo, predictionRepo);

      const result = await useCase.execute({
        ...data
      });

      return reply.status(201).send(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }
}