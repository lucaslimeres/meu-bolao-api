import { User } from "@/domain/entities";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    isAdmin(userId: string): Promise<boolean>;
    promoteToAdmin(userId: string, level: 'super_admin' | 'moderator'): Promise<void>;
}