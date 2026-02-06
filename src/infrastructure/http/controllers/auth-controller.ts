import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { UserRepository } from '@/infrastructure/database/mysql';
import { LoginUserUseCase } from '@/application/use-cases';
import { loginSchema } from '@/application/schemas';

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const userRepository = new UserRepository(db);
    const loginUserUseCase = new LoginUserUseCase(userRepository);

    try {
      const validatedData = loginSchema.parse(request.body);
  
      const data = validatedData;
      const user = await loginUserUseCase.execute(data);

      const token = await (reply as any).jwtSign(
        { id: user.id },
        { expiresIn: '7d' }
      );

      return reply.status(200).send({ user, token });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(401).send({ errors: JSON.parse(error.message) });

      return reply.status(401).send({ message: error.message });
    }
  }
}