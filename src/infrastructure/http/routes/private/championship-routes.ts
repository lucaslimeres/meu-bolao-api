import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { ChampionshipController } from '../../controllers';

const championshipController = new ChampionshipController();

export async function privateChampionshipRoutes(app: FastifyInstance) {
  // Todas as rotas aqui requerem autenticação e privilégio de admin
  app.addHook('preHandler', authenticate);

  app.get('/', championshipController.listChampionships);
}