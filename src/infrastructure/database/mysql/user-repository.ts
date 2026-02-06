import { User } from "@/domain/entities";
import { IUserRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class UserRepository implements IUserRepository {
  constructor(private db: Knex) {}

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db("users").where({ email }).first();
    if (!row) return null;

    return new User(
      { name: row.name, email: row.email, passwordHash: row.password },
      row.id,
      row.created_at
    );
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db("users").where({ id }).first();
    if (!row) return null;

    return new User(
      { name: row.name, email: row.email, passwordHash: row.password },
      row.id,
      row.created_at
    );
  }

  async save(user: User): Promise<void> {
    await this.db("users").insert({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.passwordHash,
      created_at: user.createdAt,
    });
  }

  async isAdmin(userId: string): Promise<boolean> {
    const row = await this.db("system_admins")
      .where({ user_id: userId, is_active: true })
      .first();

    console.log({ row });

    return !!row;
  }

  async promoteToAdmin(userId: string, level: 'super_admin' | 'moderator'): Promise<void> {
    // Insere ou atualiza o status de admin
    const exists = await this.db("system_admins").where({ user_id: userId }).first();
    
    if (exists) {
      await this.db("system_admins").where({ user_id: userId }).update({
        access_level: level,
        is_active: true
      });
    } else {
      await this.db("system_admins").insert({
        user_id: userId,
        access_level: level,
        is_active: true
      });
    }
  }
}
