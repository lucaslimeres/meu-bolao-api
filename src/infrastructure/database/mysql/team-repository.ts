import { Team } from "@/domain/entities/team";
import { ITeamRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class TeamRepository implements ITeamRepository {
  constructor(private db: Knex) {}

  async create(team: Team, championshipId: number): Promise<void> {
    await this.db.transaction(async (trx) => {
      // 1. Inserir o time (ou recuperar se já existir pelo nome, dependendo da regra)
      const [teamId] = await trx("teams").insert({
        name: team.name,
        badge_url: team.badgeUrl
      });

      // 2. Criar o vínculo com o campeonato
      await trx("championship_teams").insert({
        championship_id: championshipId,
        team_id: teamId
      });
    });
  }

  async listByChampionship(championshipId: number): Promise<Team[]> {
    const rows = await this.db("teams as t")
      .join("championship_teams as ct", "t.id", "ct.team_id")
      .where("ct.championship_id", championshipId)
      .select("t.*");

    return rows.map(row => new Team({ name: row.name, badgeUrl: row.badge_url }, row.id));
  }

  async findAll(): Promise<Team[]> {
    const rows = await this.db("teams");
    return rows.map(row => new Team({ name: row.name, badgeUrl: row.badge_url }, row.id));
  }

  async findById(id: number): Promise<Team | null> {
    const row = await this.db("teams").where({ id }).first();
    if (!row) return null;
    return new Team({ name: row.name, badgeUrl: row.badge_url }, row.id);
  }
}
