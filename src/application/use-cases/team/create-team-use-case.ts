import { Team } from "@/domain/entities";
import { IChampionshipRepository, ITeamRepository } from "@/domain/repositories";

interface CreateTeamRequest {
  name: string;
  badgeUrl?: string;
  championshipId: number; // Campo obrigatório agora
}

export class CreateTeamUseCase {
  constructor(
    private teamRepository: ITeamRepository,
    private championshipRepository: IChampionshipRepository
  ) {}

  async execute({ name, badgeUrl, championshipId }: CreateTeamRequest) {
    // 1. Validar se o campeonato existe
    const championship = await this.championshipRepository.findById(championshipId);
    if (!championship) {
      throw new Error("Campeonato não encontrado.");
    }

    const team = new Team({ name, badgeUrl });

    // 2. Salva o time e cria o vínculo na tabela associativa
    await this.teamRepository.create(team, championshipId);
    
    return team;
  }
}