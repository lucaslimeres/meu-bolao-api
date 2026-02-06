import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../database/connection';
import { UserRepository } from '@/infrastructure/database/mysql';
import { LoginUserUseCase } from '@/application/use-cases';

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const userRepository = new UserRepository(db);
    const loginUserUseCase = new LoginUserUseCase(userRepository);

    try {
      const data = request.body as any;
      const user = await loginUserUseCase.execute(data);

      const token = await (reply as any).jwtSign(
        { id: user.id },
        { expiresIn: '7d' }
      );

      return reply.status(200).send({ user, token });
    } catch (error: any) {
      return reply.status(401).send({ message: error.message });
    }
  }
}