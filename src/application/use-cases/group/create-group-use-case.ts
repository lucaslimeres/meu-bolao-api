import { Group, PrivacyType } from "@/domain/entities";
import { IGroupRepository } from "@/domain/repositories";
import { v4 as uuidv4 } from "uuid";

interface CreateGroupRequest {
  ownerId: string;
  championshipId: number;
  title: string;
  privacyType: PrivacyType;
  entryDeadline: string;
  maxMembers: number;
  entryFee: number;
  hasPrize: boolean;
}

export class CreateGroupUseCase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute(data: CreateGroupRequest) {
    // Gerar código de convite aleatório (6 caracteres)
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const group = new Group({
      ownerId: data.ownerId,
      championshipId: data.championshipId,
      title: data.title,
      inviteCode,
      privacyType: data.privacyType,
      entryDeadline: new Date(data.entryDeadline),
      maxMembers: data.maxMembers,
      entryFee: data.entryFee,
      hasPrize: data.hasPrize
    }, uuidv4());

    await this.groupRepository.create(group);
    return group;
  }
}