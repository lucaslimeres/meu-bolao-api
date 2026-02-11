import { User } from "@/domain/entities";
import { IUserRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class UserRepository implements IUserRepository {
  constructor(private db: Knex) {}

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db("users").where({ email }).first();
    if (!row) return null;
    return this.mapToEntity(row);
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db("users").where({ id }).first();
    if (!row) return null;
    return this.mapToEntity(row);
  }

  async save(user: User): Promise<void> {
    await this.db("users").insert({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.passwordHash,
      created_at: user.createdAt,
      is_active: true // Por padrão, utilizadores novos são ativos
    });
  }

  async isAdmin(userId: string): Promise<boolean> {
    const row = await this.db("system_admins")
      .where({ user_id: userId, is_active: true })
      .first();
    return !!row;
  }

  async promoteToAdmin(userId: string, level: 'super_admin' | 'moderator'): Promise<void> {
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

  async findAll(): Promise<User[]> {
    const rows = await this.db("users").orderBy("created_at", "desc");
    return rows.map(row => this.mapToEntity(row));
  }

  async updateStatus(userId: string, isActive: boolean): Promise<void> {
    await this.db("users")
      .where({ id: userId })
      .update({ is_active: isActive });
  }

  /**
   * Helper para converter o registo da base de dados na entidade de domínio
   */
  private mapToEntity(row: any): User {
    const user = new User(
      {
        name: row.name,
        email: row.email,
        passwordHash: row.password,
      },
      row.id,
      new Date(row.created_at)
    );
    
    // Podemos anexar propriedades extras se necessário, 
    // ou expandir a entidade User para incluir o campo isActive
    return user;
  }
}
