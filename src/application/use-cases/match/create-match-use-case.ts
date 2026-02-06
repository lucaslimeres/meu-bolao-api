import { Match } from "@/domain/entities";
import { IMatchRepository } from "@/domain/repositories";


interface CreateMatchRequest {
  championshipId: number;
  homeTeamId: number;
  awayTeamId: number;
  matchDate: Date;
}

export class CreateMatchUseCase {
  constructor(private matchRepository: IMatchRepository) {}

  async execute({ championshipId, homeTeamId, awayTeamId, matchDate }: CreateMatchRequest) {
    // 1. Validar se não é a mesma equipa
    if (homeTeamId === awayTeamId) {
      throw new Error("Uma equipa não pode jogar contra si mesma.");
    }

    // 2. Validar se ambas as equipas pertencem ao campeonato
    const isHomeIn = await this.matchRepository.isTeamInChampionship(homeTeamId, championshipId);
    const isAwayIn = await this.matchRepository.isTeamInChampionship(awayTeamId, championshipId);

    if (!isHomeIn || !isAwayIn) {
      throw new Error("Uma ou ambas as equipas não estão inscritas neste campeonato.");
    }

    const match = new Match({
      championshipId,
      homeTeamId,
      awayTeamId,
      matchDate,
      homeScore: 0,
      awayScore: 0,
      status: 'scheduled'
    });

    console.log("Criando partida:", match);

    await this.matchRepository.create(match);
    return match;
  }
}