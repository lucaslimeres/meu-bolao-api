import { IUserRepository } from "@/domain/repositories";

interface PromoteRequest {
  userId: string;
  level: 'super_admin' | 'moderator';
}

export class PromoteUserToAdminUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ userId, level }: PromoteRequest) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Utilizador não encontrado.");
    }

    await this.userRepository.promoteToAdmin(userId, level);
  }
}