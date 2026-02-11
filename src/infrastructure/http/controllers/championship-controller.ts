import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { ChampionshipRepository, GroupRepository, PredictionRepository } from '@/infrastructure/database/mysql';
import { CreateChampionshipUseCase, FinishChampionshipUseCase } from '@/application/use-cases';
import { createChampionshipSchema, finishChampionshipParams } from '@/application/schemas';
import { logAction } from '../middlewares/log-action-middleware';

export class ChampionshipController {
  async createChampionship(request: FastifyRequest, reply: FastifyReply) {
    const championshipRepository = new ChampionshipRepository(db);
    const useCase = new CreateChampionshipUseCase(championshipRepository);

    try {
      const validatedData = createChampionshipSchema.parse(request.body);
  
      const data = validatedData;
      const championship = await useCase.execute(data);

      const user = request.user as { id: string };
      await logAction(user.id, `Criou o campeonato de ID ${championship.id}`);

      return reply.status(201).send(championship);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      
      return reply.status(400).send({ message: error.message });
    }
  }

  async listChampionships(request: FastifyRequest, reply: FastifyReply) {
    const championshipRepository = new ChampionshipRepository(db);
    const list = await championshipRepository.findAll();
    return reply.status(200).send(list);
  }

  async finishChampionship(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: championshipId } = finishChampionshipParams.parse(request.params);

      const champRepo = new ChampionshipRepository(db);
      const groupRepo = new GroupRepository(db);
      const predictionRepo = new PredictionRepository(db);
      
      const useCase = new FinishChampionshipUseCase(champRepo, groupRepo, predictionRepo);

      const user = request.user as { id: string };
      await logAction(user.id, `Finalizou o campeonato de ID ${championshipId}`);      

      const result = await useCase.execute({ championshipId });
      return reply.status(200).send(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      
      return reply.status(400).send({ message: error.message });
    }
  }
}