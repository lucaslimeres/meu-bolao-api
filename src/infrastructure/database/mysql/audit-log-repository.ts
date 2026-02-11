import { AuditLog } from "@/domain/entities";
import { IAuditLogRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class AuditLogRepository implements IAuditLogRepository {
  constructor(private db: Knex) {}

  async create(log: AuditLog): Promise<void> {
    await this.db("admin_audit_logs").insert({
      admin_id: log.adminId,
      action: log.action,
      executed_at: log.executedAt
    });
  }

  async findAll(): Promise<any[]> {
    return await this.db("admin_audit_logs as l")
      .join("users as u", "l.admin_id", "u.id")
      .select(
        "l.id",
        "l.action",
        "l.executed_at",
        "u.name as admin_name",
        "u.email as admin_email"
      )
      .orderBy("l.executed_at", "desc");
  }
}