import { FastifyInstance } from 'fastify';
import { GroupController } from '../../controllers/group-controller';
import { authenticate } from '../../middlewares/auth-middleware';

const groupController = new GroupController();

export async function groupRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.post('/', groupController.create);
  app.get('/public', groupController.listPublic);
  app.get('/me', groupController.listMyGroups);
}