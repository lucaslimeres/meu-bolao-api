import { IGroupRepository, IPredictionRepository } from "@/domain/repositories";

interface GetRankingRequest {
  groupId: string;
  userId: string; // Para validar se quem pede o ranking pertence ao grupo
}

export class GetGroupRankingUseCase {
  constructor(
    private predictionRepository: IPredictionRepository,
    private groupRepository: IGroupRepository
  ) {}

  async execute({ groupId, userId }: GetRankingRequest) {
    // 1. Validar se o grupo existe
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new Error("Grupo não encontrado.");
    }

    // 2. Validar se o utilizador pertence ao grupo para ver o ranking
    const isMember = await this.predictionRepository.isUserInGroup(userId, groupId);
    if (!isMember) {
      throw new Error("Você precisa ser membro do grupo para visualizar a classificação.");
    }

    // 3. Obter o ranking processado
    const ranking = await this.predictionRepository.getGroupRanking(groupId);

    return ranking;
  }
}