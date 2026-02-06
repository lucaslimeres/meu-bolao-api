import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../database/connection';
import { ChampionshipRepository } from '@/infrastructure/database/mysql';
import { CreateChampionshipUseCase } from '@/application/use-cases';

export class ChampionshipController {
  async createChampionship(request: FastifyRequest, reply: FastifyReply) {
    const championshipRepository = new ChampionshipRepository(db);
    const useCase = new CreateChampionshipUseCase(championshipRepository);

    try {
      const data = request.body as any;
      const championship = await useCase.execute(data);
      return reply.status(201).send(championship);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async listChampionships(request: FastifyRequest, reply: FastifyReply) {
    const championshipRepository = new ChampionshipRepository(db);
    const list = await championshipRepository.findAll();
    return reply.status(200).send(list);
  }
}