import { IGroupRepository } from "@/domain/repositories";

interface ToggleStatusRequest {
  groupId: string;
  isActive: boolean;
}

export class ToggleGroupStatusUseCase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute({ groupId, isActive }: ToggleStatusRequest): Promise<void> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new Error("Grupo não encontrado.");

    await this.groupRepository.updateStatus(groupId, isActive);
  }
}