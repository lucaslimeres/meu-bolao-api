import { GroupPrize } from "../entities";


export interface IGroupPrizeRepository {
  save(prize: GroupPrize): Promise<void>;
  findByGroupId(groupId: string): Promise<GroupPrize | null>;
}