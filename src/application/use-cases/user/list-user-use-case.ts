import { IUserRepository } from "@/domain/repositories";

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute() {
    const users = await this.userRepository.findAll();
    // Removemos dados sensíveis como o hash da password antes de retornar
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }));
  }
}