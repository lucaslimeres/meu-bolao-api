import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { GroupRepository, WalletRepository } from '@/infrastructure/database/mysql';
import { CreateGroupUseCase, JoinGroupUseCase } from '@/application/use-cases';
import { createGroupSchema, joinGroupSchema } from '@/application/schemas';

export class GroupController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const repo = new GroupRepository(db);
    const useCase = new CreateGroupUseCase(repo);
    const user = request.user as { id: string };

    try {
      const validatedData = createGroupSchema.parse(request.body);
  
      const data = { ...validatedData, ownerId: user.id };
      const group = await useCase.execute(data);
      return reply.status(201).send(group);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      
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

  async join(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = joinGroupSchema.parse(request.body);
      const user = request.user as { id: string };

      const groupRepo = new GroupRepository(db);
      const walletRepo = new WalletRepository(db);
      const useCase = new JoinGroupUseCase(groupRepo, walletRepo);

      const result = await useCase.execute({
        ...data,
        userId: user.id
      });

      return reply.status(200).send(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      
      return reply.status(400).send({ message: error.message });
    }
  }  
}
