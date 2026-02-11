export class AuditLog {
  public readonly id?: number;
  public adminId: string;
  public action: string;
  public executedAt: Date;

  constructor(props: Omit<AuditLog, "id" | "executedAt">, id?: number, executedAt?: Date) {
    this.id = id;
    this.adminId = props.adminId;
    this.action = props.action;
    this.executedAt = executedAt || new Date();
  }
}