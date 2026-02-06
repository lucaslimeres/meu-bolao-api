import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../database/connection';
import { UserRepository } from '@/infrastructure/database/mysql';
import { PromoteUserToAdminUseCase, RegisterUserUseCase } from '@/application/use-cases';

export class UserController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const userRepository = new UserRepository(db);
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

    try {
      const data = request.body as any;
      const user = await registerUserUseCase.execute(data);
      return reply.status(201).send(user);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async promoteUser(request: FastifyRequest, reply: FastifyReply) {
    const repo = new UserRepository(db);
    const useCase = new PromoteUserToAdminUseCase(repo);
    try {
      const { userId, level } = request.body as any;
      await useCase.execute({ userId, level });
      return reply.status(200).send({ message: "Utilizador promovido com sucesso." });
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }  
}