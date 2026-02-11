import { AuditLog } from "../entities";

export interface IAuditLogRepository {
  /**
   * Regista uma nova ação administrativa no log
   */
  create(log: AuditLog): Promise<void>;

  /**
   * Lista os logs mais recentes do sistema
   */
  findAll(): Promise<any[]>;
}