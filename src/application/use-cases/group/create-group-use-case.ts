import { Group, GroupPrize, PrivacyType } from "@/domain/entities";
import { IGroupPrizeRepository, IGroupRepository } from "@/domain/repositories";
import { ENVS } from "@/utils";
import { v4 as uuidv4 } from "uuid";

interface CreateGroupRequest {
  ownerId: string;
  championshipId: number;
  title: string;
  privacyType: PrivacyType;
  entryDeadline: Date;
  maxMembers: number;
  entryFee: number;
  hasPrize: boolean;
  prizes?: {
    firstPlacePct: number;
    secondPlacePct: number;
    thirdPlacePct: number;
  };
}

export class CreateGroupUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private groupPrizeRepository: IGroupPrizeRepository
  ) {}

  async execute(data: CreateGroupRequest) {
      // 1. Validação de Prémios
    if (data.hasPrize) {
      if (!data.prizes) {
        throw new Error("As configurações de premiação são obrigatórias quando o prémio está ativo.");
      }

      const totalPct = data.prizes.firstPlacePct + data.prizes.secondPlacePct + data.prizes.thirdPlacePct;
      
      if (totalPct !== ENVS.PRIZES.TOTAL) {
        throw new Error(`A soma das percentagens de premiação deve ser exatamente ${ENVS.PRIZES.TOTAL}%.`);
      }
    }

    // Gerar código de convite aleatório (6 caracteres)
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const group = new Group({
      ownerId: data.ownerId,
      championshipId: data.championshipId,
      title: data.title,
      inviteCode,
      privacyType: data.privacyType,
      entryDeadline: data.entryDeadline,
      maxMembers: data.maxMembers,
      entryFee: data.entryFee,
      hasPrize: data.hasPrize
    }, uuidv4());

    await this.groupRepository.create(group);

    if (data.hasPrize && data.prizes) {
      const groupPrize = new GroupPrize({
        groupId: group.id,
        firstPlacePct: data.prizes.firstPlacePct,
        secondPlacePct: data.prizes.secondPlacePct,
        thirdPlacePct: data.prizes.thirdPlacePct
      });
      await this.groupPrizeRepository.save(groupPrize);
    }

    return group;
  }
}