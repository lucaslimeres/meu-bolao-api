import { IChampionshipRepository, IGroupRepository, IPredictionRepository } from "@/domain/repositories";

interface FinishChampionshipRequest {
  championshipId: number;
}

export class FinishChampionshipUseCase {
  constructor(
    private championshipRepository: IChampionshipRepository,
    private groupRepository: IGroupRepository,
    private predictionRepository: IPredictionRepository
  ) {}

  async execute({ championshipId }: FinishChampionshipRequest) {
    // 1. Validar se o campeonato existe
    const championship = await this.championshipRepository.findById(championshipId);
    if (!championship) {
      throw new Error("Campeonato não encontrado.");
    }

    if (championship.status === 'finished') {
      throw new Error("Este campeonato já foi encerrado.");
    }

    // 2. Validar se todas as partidas foram finalizadas
    const hasPending = await this.championshipRepository.hasPendingMatches(championshipId);
    if (hasPending) {
      throw new Error("Não é possível encerrar o campeonato pois existem partidas pendentes.");
    }

    // 3. Atualizar status do campeonato
    await this.championshipRepository.updateStatus(championshipId, 'finished');

    /**
     * No futuro, aqui dispararíamos a distribuição de prêmios da Wallet
     * Baseado no ranking final de cada grupo do campeonato.
     */

    return { 
      message: "Campeonato encerrado com sucesso.",
      championshipId 
    };
  }
}