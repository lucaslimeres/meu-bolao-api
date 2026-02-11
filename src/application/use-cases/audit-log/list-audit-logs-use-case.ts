import { IAuditLogRepository } from "@/domain/repositories";

export class ListAuditLogsUseCase {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  async execute() {
    return await this.auditLogRepository.findAll();
  }
}