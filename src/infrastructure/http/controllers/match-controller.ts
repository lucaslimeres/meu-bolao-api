import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { MatchRepository } from '@/infrastructure/database/mysql';
import { CreateMatchUseCase } from '@/application/use-cases';
import { createMatchSchema, listTeamSchema } from '@/application/schemas';

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
}