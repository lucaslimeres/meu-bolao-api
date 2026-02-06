import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../database/connection';
import { ChampionshipRepository, TeamRepository } from '@/infrastructure/database/mysql';
import { CreateTeamUseCase } from '@/application/use-cases';

export class TeamController {
  // Gestão de Equipes
  async createTeam(request: FastifyRequest, reply: FastifyReply) {
    const teamRepo = new TeamRepository(db);
    const champRepo = new ChampionshipRepository(db);
    const useCase = new CreateTeamUseCase(teamRepo, champRepo);

    try {
      const { name, badgeUrl, championshipId } = request.body as any;
      
      if (!championshipId) {
        return reply.status(400).send({ message: "O ID do campeonato é obrigatório." });
      }

      const team = await useCase.execute({ name, badgeUrl, championshipId });
      return reply.status(201).send(team);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async listTeamsByChampionship(request: FastifyRequest, reply: FastifyReply) {
    const { championshipId } = request.params as { championshipId: string };
    const repo = new TeamRepository(db);
    
    const list = await repo.listByChampionship(Number(championshipId));
    return reply.status(200).send(list);
  }
}