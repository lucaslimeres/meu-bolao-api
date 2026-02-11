import { FastifyInstance } from 'fastify';
import { GroupController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const groupController = new GroupController();

export async function privateGroupRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.post('/', groupController.create);
  app.get('/public', groupController.listPublic);
  app.get('/me', groupController.listMyGroups);
  app.post('/join', groupController.join);
  app.get('/:groupId/ranking', groupController.getRanking);
  app.get('/:groupId/matches', groupController.getMatches);
  app.get('/:groupId/members', groupController.listMembers);
}