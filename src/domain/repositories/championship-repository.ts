import { Championship, ChampionshipStatus } from "@/domain/entities";

export interface IChampionshipRepository {
  create(championship: Championship): Promise<void>;
  findById(id: number): Promise<Championship | null>;
  findAll(): Promise<Championship[]>;
  updateStatus(id: number, status: ChampionshipStatus): Promise<void>;
  hasPendingMatches(id: number): Promise<boolean>;
}
