import { db } from "../../database/connection";
import { AuditLogRepository } from "@/infrastructure/database/mysql";
import { AuditLog } from "@/domain/entities";

export async function logAction(adminId: string, action: string) {
  const repo = new AuditLogRepository(db);
  const log = new AuditLog({ adminId, action });
  await repo.create(log);
}