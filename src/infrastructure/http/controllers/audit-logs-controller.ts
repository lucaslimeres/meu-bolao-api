import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../database/connection';
import { AuditLogRepository } from '@/infrastructure/database/mysql';
import { ListAuditLogsUseCase } from '@/application/use-cases';

export class AuditLogsController {
  
  // Novo método para visualizar logs
  async listAuditLogs(request: FastifyRequest, reply: FastifyReply) {
    const repo = new AuditLogRepository(db);
    const useCase = new ListAuditLogsUseCase(repo);

    try {
      const logs = await useCase.execute();
      return reply.status(200).send(logs);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }
}