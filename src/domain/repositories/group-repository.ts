import { Group } from "@/domain/entities";

export interface IGroupRepository {
  create(group: Group): Promise<void>;
  findById(id: string): Promise<Group | null>;
  findByInviteCode(code: string): Promise<Group | null>;
  listPublic(): Promise<Group[]>;
  listByUser(userId: string): Promise<Group[]>;
}