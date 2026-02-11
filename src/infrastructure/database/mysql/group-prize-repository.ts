import { GroupPrize } from "@/domain/entities";
import { IGroupPrizeRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class GroupPrizeRepository implements IGroupPrizeRepository {
  constructor(private db: Knex) {}

  async save(prize: GroupPrize): Promise<void> {
    await this.db("group_prizes").insert({
      group_id: prize.groupId,
      first_place_pct: prize.firstPlacePct,
      second_place_pct: prize.secondPlacePct,
      third_place_pct: prize.thirdPlacePct
    }).onConflict("group_id").merge();
  }

  async findByGroupId(groupId: string): Promise<GroupPrize | null> {
    const row = await this.db("group_prizes").where({ group_id: groupId }).first();
    if (!row) return null;

    return new GroupPrize({
      groupId: row.group_id,
      firstPlacePct: Number(row.first_place_pct),
      secondPlacePct: Number(row.second_place_pct),
      thirdPlacePct: Number(row.third_place_pct)
    });
  }
}