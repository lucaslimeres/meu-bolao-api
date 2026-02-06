import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../database/connection';
import { GroupRepository } from '@/infrastructure/database/mysql';
import { CreateGroupUseCase } from '@/application/use-cases';

export class GroupController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const repo = new GroupRepository(db);
    const useCase = new CreateGroupUseCase(repo);
    const user = request.user as { id: string };

    try {
      const data = { ...(request.body as any), ownerId: user.id };
      const group = await useCase.execute(data);
      return reply.status(201).send(group);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async listPublic(_request: FastifyRequest, reply: FastifyReply) {
    const repo = new GroupRepository(db);
    const groups = await repo.listPublic();
    return reply.status(200).send(groups);
  }

  async listMyGroups(request: FastifyRequest, reply: FastifyReply) {
    const repo = new GroupRepository(db);
    const user = request.user as { id: string };
    const groups = await repo.listByUser(user.id);
    return reply.status(200).send(groups);
  }
}
