import { Prediction } from "../entities";

export interface IPredictionRepository {
  save(prediction: Prediction): Promise<void>;
  findByUserGroupAndMatch(userId: string, groupId: string, matchId: number): Promise<Prediction | null>;
  isUserInGroup(userId: string, groupId: string): Promise<boolean>;
}