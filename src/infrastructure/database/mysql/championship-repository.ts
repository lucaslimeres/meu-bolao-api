import { Championship } from "@/domain/entities/championship";
import { IChampionshipRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class ChampionshipRepository implements IChampionshipRepository {
  constructor(private db: Knex) {}

  async create(championship: Championship): Promise<void> {
    await this.db("championships").insert({
      title: championship.title,
      description: championship.description,
      is_active: championship.isActive
    });
  }

  async findById(id: number): Promise<Championship | null> {
    const row = await this.db("championships").where({ id }).first();
    if (!row) return null;
    return new Championship({
      title: row.title,
      description: row.description,
      isActive: row.is_active
    }, row.id);
  }

  async findAll(): Promise<Championship[]> {
    const rows = await this.db("championships");
    return rows.map(row => new Championship({
      title: row.title,
      description: row.description,
      isActive: row.is_active
    }, row.id));
  }
}