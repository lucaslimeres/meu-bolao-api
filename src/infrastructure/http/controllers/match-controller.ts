import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../database/connection';
import { MatchRepository } from '@/infrastructure/database/mysql';
import { CreateMatchUseCase } from '@/application/use-cases';

export class MatchController {
  async createMatch(request: FastifyRequest, reply: FastifyReply) {
    const matchRepository = new MatchRepository(db);
    const useCase = new CreateMatchUseCase(matchRepository);

    try {
      const data = request.body as any;
      const match = await useCase.execute(data);
      return reply.status(201).send(match);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async listMatches(request: FastifyRequest, reply: FastifyReply) {
    const { championshipId } = request.params as { championshipId: string };

    const matchRepository = new MatchRepository(db);
    const list = await matchRepository.listByChampionship(Number(championshipId));
    return reply.status(200).send(list);
  }
}