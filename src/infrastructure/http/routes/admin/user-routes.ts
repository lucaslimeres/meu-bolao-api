import { FastifyInstance } from 'fastify';
import { UserController } from '../../controllers';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';

const userController = new UserController();

export async function adminUserRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);  

  app.get('/', userController.listUsers);
  app.post('/promote-user', userController.promoteUser);
  app.patch('/status', userController.toggleUserStatus);
}