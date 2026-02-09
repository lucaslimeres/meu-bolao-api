import { Group } from "@/domain/entities";
import { IGroupRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class GroupRepository implements IGroupRepository {
  constructor(private db: Knex) {}

  async create(group: Group): Promise<void> {
    await this.db("groups").insert({
      id: group.id,
      owner_id: group.ownerId,
      championship_id: group.championshipId,
      title: group.title,
      invite_code: group.inviteCode,
      privacy_type: group.privacyType,
      entry_deadline: group.entryDeadline,
      max_members: group.maxMembers,
      entry_fee: group.entryFee,
      has_prize: group.hasPrize
    });

    // Dono entra automaticamente no grupo
    await this.db("group_members").insert({
      group_id: group.id,
      user_id: group.ownerId,
      paid: true
    });
  }

  async findById(id: string): Promise<Group | null> {
    const row = await this.db("groups").where({ id }).first();
    if (!row) return null;
    return this.mapToEntity(row);
  }

  async findByInviteCode(code: string): Promise<Group | null> {
    const row = await this.db("groups").where({ invite_code: code }).first();
    if (!row) return null;
    return this.mapToEntity(row);
  }

  async listPublic(): Promise<Group[]> {
    const rows = await this.db("groups").where({ privacy_type: 'public' });
    return rows.map(this.mapToEntity);
  }

  async listByUser(userId: string): Promise<Group[]> {
    const rows = await this.db("groups as g")
      .join("group_members as gm", "g.id", "gm.group_id")
      .where("gm.user_id", userId)
      .select("g.*");
    return rows.map(this.mapToEntity);
  }

  async addMember(groupId: string, userId: string, paid: boolean): Promise<void> {
    await this.db("group_members").insert({
      group_id: groupId,
      user_id: userId,
      paid: paid,
      joined_at: new Date()
    });
  }

  async countMembers(groupId: string): Promise<number> {
    const result = await this.db("group_members")
      .where({ group_id: groupId })
      .count("user_id as count")
      .first();
    
    return Number(result?.count || 0);
  }  

  private mapToEntity(row: any): Group {
    return new Group({
      ownerId: row.owner_id,
      championshipId: row.championship_id,
      title: row.title,
      inviteCode: row.invite_code,
      privacyType: row.privacy_type,
      entryDeadline: row.entry_deadline,
      maxMembers: row.max_members,
      entryFee: row.entry_fee,
      hasPrize: row.has_prize
    }, row.id);
  }
}