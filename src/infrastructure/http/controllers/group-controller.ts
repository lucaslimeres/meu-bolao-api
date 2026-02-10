import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { GroupRepository, MatchRepository, PredictionRepository, WalletRepository } from '@/infrastructure/database/mysql';
import { CreateGroupUseCase, GetGroupRankingUseCase, JoinGroupUseCase, ListGroupMatchesUseCase } from '@/application/use-cases';
import { createGroupSchema, joinGroupSchema, groupIdParamsSchema } from '@/application/schemas';
import { ListGroupMembersUseCase } from '@/application/use-cases/group/list-group-members-use-case';
import { KnexGroupPrizeRepository } from '@/infrastructure/database/mysql/group-prize-repositpory';

export class GroupController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const groupRepo = new GroupRepository(db);
    const prizeRepo = new KnexGroupPrizeRepository(db);
    const useCase = new CreateGroupUseCase(groupRepo, prizeRepo);
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

  async getRanking(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { groupId } = groupIdParamsSchema.parse(request.params);
      const user = request.user as { id: string };

      const predictionRepo = new PredictionRepository(db);
      const groupRepo = new GroupRepository(db);
      const useCase = new GetGroupRankingUseCase(predictionRepo, groupRepo);

      const ranking = await useCase.execute({
        groupId,
        userId: user.id
      });

      return reply.status(200).send(ranking);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      
      return reply.status(400).send({ message: error.message });
    }
  }

  async getMatches(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { groupId } = groupIdParamsSchema.parse(request.params);
      const user = request.user as { id: string };

      const matchRepo = new MatchRepository(db);
      const groupRepo = new GroupRepository(db);
      const predictionRepo = new PredictionRepository(db);
      const useCase = new ListGroupMatchesUseCase(matchRepo, groupRepo, predictionRepo);

      const matches = await useCase.execute({
        groupId,
        userId: user.id
      });

      return reply.status(200).send(matches);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async listMembers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { groupId } = groupIdParamsSchema.parse(request.params);
      const user = request.user as { id: string };

      const groupRepo = new GroupRepository(db);
      const useCase = new ListGroupMembersUseCase(groupRepo);

      const members = await useCase.execute({
        groupId,
        userId: user.id
      });

      return reply.status(200).send(members);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }
}
