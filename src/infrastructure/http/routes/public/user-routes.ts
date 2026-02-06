import { FastifyInstance } from 'fastify';
import { UserController } from '../../controllers';

const userController = new UserController();

export async function publicUserRoutes(app: FastifyInstance) {
  app.post('/register', userController.register);
}