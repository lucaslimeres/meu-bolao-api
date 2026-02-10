import { IGroupRepository, IMatchRepository, IPredictionRepository } from "@/domain/repositories";

interface ListMatchesRequest {
  groupId: string;
  userId: string;
}

export class ListGroupMatchesUseCase {
  constructor(
    private matchRepository: IMatchRepository,
    private groupRepository: IGroupRepository,
    private predictionRepository: IPredictionRepository
  ) {}

  async execute({ groupId, userId }: ListMatchesRequest) {
    // 1. Validar se o grupo existe e obter o campeonato associado
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new Error("Grupo não encontrado.");
    }

    // 2. Validar se o utilizador pertence ao grupo
    const isMember = await this.predictionRepository.isUserInGroup(userId, groupId);
    if (!isMember) {
      throw new Error("Você não tem permissão para ver os jogos deste grupo.");
    }

    // 3. Obter partidas do campeonato com os palpites específicos do utilizador
    const matches = await this.matchRepository.listWithUserPredictions(
      group.championshipId,
      groupId,
      userId
    );

    return matches;
  }
}