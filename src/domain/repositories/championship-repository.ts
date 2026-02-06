import { Championship } from "@/domain/entities";

export interface IChampionshipRepository {
  create(championship: Championship): Promise<void>;
  findById(id: number): Promise<Championship | null>;
  findAll(): Promise<Championship[]>;
}
