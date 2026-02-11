import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { ChampionshipRepository, TeamRepository } from '@/infrastructure/database/mysql';
import { CreateTeamUseCase } from '@/application/use-cases';
import { createTeamSchema, listTeamSchema } from '@/application/schemas';
import { logAction } from '../middlewares/log-action-middleware';

export class TeamController {
  // Gestão de Equipes
  async createTeam(request: FastifyRequest, reply: FastifyReply) {
    const teamRepo = new TeamRepository(db);
    const champRepo = new ChampionshipRepository(db);
    const useCase = new CreateTeamUseCase(teamRepo, champRepo);

    try {
      const validatedData = createTeamSchema.parse(request.body);
  
      const { name, badgeUrl, championshipId } = validatedData;
      
      if (!championshipId) {
        return reply.status(400).send({ message: "O ID do campeonato é obrigatório." });
      }

      const team = await useCase.execute({ name, badgeUrl, championshipId });

      const user = request.user as { id: string };
      await logAction(user.id, `Criou a equipe de ID ${team.id}`);

      return reply.status(201).send(team);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async listTeamsByChampionship(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedData = listTeamSchema.parse(request.params);

      const { championshipId } = validatedData
      const repo = new TeamRepository(db);
      
      const list = await repo.listByChampionship(Number(championshipId));
      return reply.status(200).send(list);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      
      return reply.status(400).send({ message: error.message });
    }
  }
}