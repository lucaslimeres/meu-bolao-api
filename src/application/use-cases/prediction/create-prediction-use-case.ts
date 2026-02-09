import { Prediction } from "@/domain/entities";
import { IMatchRepository, IPredictionRepository } from "@/domain/repositories";


interface CreatePredictionRequest {
  userId: string;
  groupId: string;
  matchId: number;
  homeGuess: number;
  awayGuess: number;
}

export class CreatePredictionUseCase {
  constructor(
    private predictionRepository: IPredictionRepository,
    private matchRepository: IMatchRepository
  ) {}

  async execute({ userId, groupId, matchId, homeGuess, awayGuess }: CreatePredictionRequest) {
    // 1. Validar se a partida existe
    const match = await this.matchRepository.findById(matchId);
    if (!match) {
      throw new Error("Partida não encontrada.");
    }

    // 2. Validar se a partida já começou (não pode palpitar após o início)
    if (new Date() >= new Date(match.matchDate)) {
      throw new Error("Não é permitido palpitar em jogos que já iniciaram.");
    }

    // 3. Validar se o usuário pertence ao grupo
    const isMember = await this.predictionRepository.isUserInGroup(userId, groupId);
    if (!isMember) {
      throw new Error("Você não tem permissão para palpitar neste grupo.");
    }

    const prediction = new Prediction({
      userId,
      groupId,
      matchId,
      homeGuess,
      awayGuess,
      pointsEarned: 0
    });

    await this.predictionRepository.save(prediction);
    return prediction;
  }
}