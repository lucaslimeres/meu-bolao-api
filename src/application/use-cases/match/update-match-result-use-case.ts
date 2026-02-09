import { IMatchRepository, IPredictionRepository } from "@/domain/repositories";
import { ENVS } from "@/utils";

interface UpdateResultRequest {
  matchId: number;
  homeScore: number;
  awayScore: number;
}

export class UpdateMatchResultUseCase {
  constructor(
    private matchRepository: IMatchRepository,
    private predictionRepository: IPredictionRepository
  ) {}

  async execute({ matchId, homeScore, awayScore }: UpdateResultRequest) {
    // 1. Validar se a partida existe
    const match = await this.matchRepository.findById(matchId);
    if (!match) throw new Error("Partida não encontrada.");

    // 2. Atualizar o resultado da partida
    await this.matchRepository.updateResult(matchId, homeScore, awayScore);
    console.log(`Resultado da partida ${matchId} atualizado para ${homeScore} x ${awayScore}.`);

    // 3. Buscar todos os palpites para esta partida
    const predictions = await this.predictionRepository.listByMatch(matchId);
    console.log(`Encontrados ${predictions.length} palpites para a partida ${matchId}.`);

    // 4. Calcular e atualizar pontos para cada palpite
    for (const prediction of predictions) {
      const points = this.calculatePoints(
        prediction.homeGuess,
        prediction.awayGuess,
        homeScore,
        awayScore
      );

      if (prediction.id) {
        await this.predictionRepository.updatePoints(prediction.id, points);
      }
    }

    return { message: "Resultado atualizado e pontos calculados com sucesso." };
  }

  private calculatePoints(hG: number, aG: number, hA: number, aA: number): number {
    // Placar Exato
    if (hG === hA && aG === aA) return ENVS.POINTS_CONFIG.EXACT_SCORE;

    const guessDiff = hG - aG;
    const actualDiff = hA - aA;
    const winnerGuess = Math.sign(guessDiff);
    const winnerActual = Math.sign(actualDiff);

    // Acertou vencedor e saldo
    if (winnerGuess === winnerActual && guessDiff === actualDiff) return ENVS.POINTS_CONFIG.WINNER_AND_GOAL_DIFF;

    // Acertou apenas o vencedor ou empate
    if (winnerGuess === winnerActual) return ENVS.POINTS_CONFIG.WINNER_ONLY;

    // Acertou golos de pelo menos uma equipa
    if (hG === hA || aG === aA) return ENVS.POINTS_CONFIG.ONE_TEAM_GOALS;

    return 0;
  }
}