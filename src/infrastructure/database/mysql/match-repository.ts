import { Match } from "@/domain/entities";
import { IMatchRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class MatchRepository implements IMatchRepository {
  constructor(private db: Knex) {}

  async create(match: Match): Promise<void> {
    await this.db("matches").insert({
      championship_id: match.championshipId,
      home_team_id: match.homeTeamId,
      away_team_id: match.awayTeamId,
      match_date: match.matchDate,
      status: match.status
    });
  }

  async findById(id: number): Promise<Match | null> {
    const row = await this.db("matches").where({ id }).first();
    if (!row) return null;
    return new Match({
      championshipId: row.championship_id,
      homeTeamId: row.home_team_id,
      awayTeamId: row.away_team_id,
      matchDate: row.match_date,
      homeScore: row.home_score,
      awayScore: row.away_score,
      status: row.status
    }, row.id);
  }

  async listByChampionship(championshipId: number): Promise<Match[]> {
    const rows = await this.db("matches").where({ championship_id: championshipId });
    return rows.map(row => new Match({
      championshipId: row.championship_id,
      homeTeamId: row.home_team_id,
      awayTeamId: row.away_team_id,
      matchDate: row.match_date,
      homeScore: row.home_score,
      awayScore: row.away_score,
      status: row.status
    }, row.id));
  }

  async updateResult(matchId: number, homeScore: number, awayScore: number): Promise<void> {
    await this.db("matches").where({ id: matchId }).update({
      home_score: homeScore,
      away_score: awayScore,
      status: 'finished'
    });
  }

  async isTeamInChampionship(teamId: number, championshipId: number): Promise<boolean> {
    const row = await this.db("championship_teams")
      .where({ team_id: teamId, championship_id: championshipId })
      .first();
    return !!row;
  }
}