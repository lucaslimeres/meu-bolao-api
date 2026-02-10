import { Prediction } from "../entities";

export interface IPredictionRepository {
  save(prediction: Prediction): Promise<void>;
  findByUserGroupAndMatch(userId: string, groupId: string, matchId: number): Promise<Prediction | null>;
  isUserInGroup(userId: string, groupId: string): Promise<boolean>;
  listByMatch(matchId: number): Promise<Prediction[]>;
  updatePoints(predictionId: number, points: number): Promise<void>;  
  getGroupRanking(groupId: string): Promise<{
    userId: string;
    userName: string;
    totalPoints: number;
    exactScores: number;
  }[]>;  
}