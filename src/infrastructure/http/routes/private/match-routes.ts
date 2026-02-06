import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { MatchController } from '../../controllers';

const matchController = new MatchController();

export async function matchRoutes(app: FastifyInstance) {
  // Todas as rotas aqui requerem autenticação e privilégio de admin
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.post('/', matchController.createMatch);
  app.get('/championship/:championshipId', matchController.listMatches);
}