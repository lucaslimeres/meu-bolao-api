import { FastifyInstance } from 'fastify';
import { AuthController } from '../../controllers';

const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', authController.login);
}