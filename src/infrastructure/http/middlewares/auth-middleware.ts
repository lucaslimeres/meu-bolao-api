import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../database/connection";
import { UserRepository } from "@/infrastructure/database/mysql";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: "Não autorizado." });
  }
}

export async function checkAdmin(request: FastifyRequest, reply: FastifyReply) {
  const userRepository = new UserRepository(db);
  const user = request.user as { id: string };

  console.log({ user });

  const isAdmin = await userRepository.isAdmin(user.id);

  console.log({ isAdmin });

  if (!isAdmin) {
    return reply.status(403).send({ message: "Acesso restrito a administradores." });
  }
}
