import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { UserRepository } from '@/infrastructure/database/mysql';
import { PromoteUserToAdminUseCase, RegisterUserUseCase } from '@/application/use-cases';
import { createUserSchema, promoteUserSchema } from '@/application/schemas';

export class UserController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const userRepository = new UserRepository(db);
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

    try {
      const validatedData = createUserSchema.parse(request.body);
  
      const data = validatedData;
      const user = await registerUserUseCase.execute(data);
      return reply.status(201).send(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async promoteUser(request: FastifyRequest, reply: FastifyReply) {
    const repo = new UserRepository(db);
    const useCase = new PromoteUserToAdminUseCase(repo);

    try {
      const validatedData = promoteUserSchema.parse(request.body);
  
      const { userId, level } = validatedData;
      await useCase.execute({ userId, level });
      return reply.status(200).send({ message: "Utilizador promovido com sucesso." });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }  
}