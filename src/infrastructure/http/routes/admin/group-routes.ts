import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { GroupController } from '../../controllers';
import { app } from '../../app';

const groupController = new GroupController();

export async function adminGroupRoutes(app: FastifyInstance) {
  // Todas as rotas aqui requerem autenticação e privilégio de admin
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.get('/', groupController.listGroups);
  app.patch('/status', groupController.toggleGroupStatus);
}