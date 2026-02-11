import { IGroupRepository } from "@/domain/repositories";

export class ListAllGroupsUseCase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute() {
    return await this.groupRepository.listAll();
  }
}