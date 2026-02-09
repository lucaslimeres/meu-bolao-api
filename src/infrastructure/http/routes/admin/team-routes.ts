import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { TeamController } from '../../controllers';

const teamController = new TeamController();

export async function teamRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  // Equipes
  app.post('/', teamController.createTeam);
  app.get('/championship/:championshipId', teamController.listTeamsByChampionship);
}