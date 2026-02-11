import { FastifyInstance } from 'fastify';
import { AuditLogsController } from '../../controllers';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';

const auditLogsController = new AuditLogsController();

export async function adminAuditLogsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  // Auditoria (Nova Rota)
  app.get('/audit-logs', auditLogsController.listAuditLogs);
}