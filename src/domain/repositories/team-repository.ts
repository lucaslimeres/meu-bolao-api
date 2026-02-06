import { Team } from "@/domain/entities";

export interface ITeamRepository {
  create(team: Team, championshipId: number): Promise<void>;
  listByChampionship(championshipId: number): Promise<Team[]>;  
  findAll(): Promise<Team[]>;
  findById(id: number): Promise<Team | null>;
}
