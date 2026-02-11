import { FastifyInstance } from 'fastify';
import { AuthController } from '../../controllers';

const authController = new AuthController();

export async function publicAuthRoutes(app: FastifyInstance) {
  app.post('/login', authController.login);
}