import { FastifyInstance } from 'fastify';
import { UserController } from '../../controllers';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';

const userController = new UserController();

export async function privateUserRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);  

  app.post('/promote-user', userController.promoteUser);
}