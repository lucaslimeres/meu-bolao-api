import { IUserRepository } from "@/domain/repositories";

interface ToggleStatusRequest {
  userId: string;
  isActive: boolean;
}

export class ToggleUserStatusUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ userId, isActive }: ToggleStatusRequest): Promise<void> {
    // 1. Verificar se o utilizador existe
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error("Utilizador não encontrado.");
    }

    // 2. Atualizar o estado no repositório
    await this.userRepository.updateStatus(userId, isActive);
  }
}