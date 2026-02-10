import { Knex } from "knex";
import { Prediction } from "@/domain/entities";
import { IPredictionRepository } from "@/domain/repositories";

export class PredictionRepository implements IPredictionRepository {
  constructor(private db: Knex) {}

  async save(prediction: Prediction): Promise<void> {
    // Usamos ON DUPLICATE KEY UPDATE para o comportamento de Upsert baseado no UNIQUE KEY (user_id, group_id, match_id)
    await this.db("predictions")
      .insert({
        user_id: prediction.userId,
        group_id: prediction.groupId,
        match_id: prediction.matchId,
        home_guess: prediction.homeGuess,
        away_guess: prediction.awayGuess,
        points_earned: 0
      })
      .onConflict(['user_id', 'group_id', 'match_id'])
      .merge({
        home_guess: prediction.homeGuess,
        away_guess: prediction.awayGuess
      });
  }

  async findByUserGroupAndMatch(userId: string, groupId: string, matchId: number): Promise<Prediction | null> {
    const row = await this.db("predictions")
      .where({ user_id: userId, group_id: groupId, match_id: matchId })
      .first();

    if (!row) return null;

    return new Prediction({
      userId: row.user_id,
      groupId: row.group_id,
      matchId: row.match_id,
      homeGuess: row.home_guess,
      awayGuess: row.away_guess,
      pointsEarned: row.points_earned
    }, row.id);
  }

  async isUserInGroup(userId: string, groupId: string): Promise<boolean> {
    const row = await this.db("group_members")
      .where({ user_id: userId, group_id: groupId })
      .first();
    return !!row;
  }

  async listByMatch(matchId: number): Promise<Prediction[]> {
    const rows = await this.db("predictions").where({ match_id: matchId });
    return rows.map(row => new Prediction({
      userId: row.user_id,
      groupId: row.group_id,
      matchId: row.match_id,
      homeGuess: row.home_guess,
      awayGuess: row.away_guess,
      pointsEarned: row.points_earned
    }, row.id));
  }

  async updatePoints(predictionId: number, points: number): Promise<void> {
    await this.db("predictions")
      .where({ id: predictionId })
      .update({ points_earned: points });
  }

  async getGroupRanking(groupId: string) {
    // Query complexa para somar pontos e contar acertos exatos (10 pontos)
    const rows = await this.db("predictions as p")
      .join("users as u", "p.user_id", "u.id")
      .where("p.group_id", groupId)
      .select(
        "u.id as userId",
        "u.name as userName",
      )
      .sum("p.points_earned as totalPoints")
      .count("p.id as totalPredictions")
      // Contagem de placares exatos (opcional para critério de desempate)
      .select(this.db.raw("SUM(CASE WHEN p.points_earned = 10 THEN 1 ELSE 0 END) as exactScores"))
      .groupBy("u.id", "u.name")
      .orderBy("totalPoints", "desc")
      .orderBy("exactScores", "desc");

    return rows.map(row => ({
      userId: row.userId,
      userName: row.userName,
      totalPoints: Number(row.totalPoints || 0),
      exactScores: Number(row.exactScores || 0)
    }));
  }
}