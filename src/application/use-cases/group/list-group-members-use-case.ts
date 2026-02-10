import { IGroupRepository } from "@/domain/repositories";

interface ListMembersRequest {
  groupId: string;
  userId: string;
}

export class ListGroupMembersUseCase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute({ groupId, userId }: ListMembersRequest) {
    // 1. Validar existência do grupo
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new Error("Grupo não encontrado.");
    }

    // 2. Validar se o utilizador que requisita a lista pertence ao grupo
    const isMember = await this.groupRepository.isUserInGroup(userId, groupId);
    if (!isMember) {
      throw new Error("Acesso negado. Você não pertence a este grupo.");
    }

    // 3. Obter lista de membros
    const members = await this.groupRepository.listMembers(groupId);

    return members;
  }
}