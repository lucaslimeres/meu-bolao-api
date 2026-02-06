import { User } from "@/domain/entities";
import { IUserRepository } from "@/domain/repositories";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, password }: RegisterUserRequest) {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("Utilizador já registado com este e-mail.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, passwordHash }, uuidv4());

    await this.userRepository.save(user);

    return { id: user.id, name: user.name, email: user.email };
  }
}