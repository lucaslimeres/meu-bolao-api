import { FastifyInstance } from 'fastify';
import { PredictionController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const predictionController = new PredictionController();

export async function privatePredictionRoutes(app: FastifyInstance) {
  // Todas as rotas de palpites exigem estar logado
  app.addHook('preHandler', authenticate);

  app.post('/', predictionController.create);
}