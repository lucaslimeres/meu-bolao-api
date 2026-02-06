import { IUserRepository } from "@/domain/repositories";
import bcrypt from "bcryptjs";

interface LoginUserRequest {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: LoginUserRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("E-mail ou palavra-passe inválidos.");
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new Error("E-mail ou palavra-passe inválidos.");
    }

    const isAdmin = await this.userRepository.isAdmin(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin
    };
  }
}
