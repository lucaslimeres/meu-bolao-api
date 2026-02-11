import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { TeamController } from '../../controllers';

const teamController = new TeamController();

export async function privateTeamRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  // Equipes
  app.get('/championship/:championshipId', teamController.listTeamsByChampionship);
}