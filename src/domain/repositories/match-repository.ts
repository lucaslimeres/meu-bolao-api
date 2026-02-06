import { Match } from "../entities/match";

export interface IMatchRepository {
  create(match: Match): Promise<void>;
  findById(id: number): Promise<Match | null>;
  listByChampionship(championshipId: number): Promise<Match[]>;
  updateResult(matchId: number, homeScore: number, awayScore: number): Promise<void>;
  // Verifica se a equipa pertence ao campeonato
  isTeamInChampionship(teamId: number, championshipId: number): Promise<boolean>;
}