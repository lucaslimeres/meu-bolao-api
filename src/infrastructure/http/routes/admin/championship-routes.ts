import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { ChampionshipController } from '../../controllers';

const championshipController = new ChampionshipController();

export async function championshipRoutes(app: FastifyInstance) {
  // Todas as rotas aqui requerem autenticação e privilégio de admin
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.post('/', championshipController.createChampionship);
  app.get('/', championshipController.listChampionships);
  app.post('/:id/finish', championshipController.finishChampionship);
}