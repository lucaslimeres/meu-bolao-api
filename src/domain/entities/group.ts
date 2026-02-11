export type PrivacyType = 'public' | 'private';

export class Group {
  public readonly id: string;
  public ownerId: string;
  public championshipId: number;
  public title: string;
  public inviteCode: string;
  public privacyType: PrivacyType;
  public entryDeadline: Date;
  public maxMembers: number;
  public entryFee: number;
  public hasPrize: boolean;
  public isActive: boolean;

  constructor(props: Omit<Group, "id" | "isActive">, id: string, isActive?: boolean) {
    this.id = id;
    this.ownerId = props.ownerId;
    this.championshipId = props.championshipId;
    this.title = props.title;
    this.inviteCode = props.inviteCode;
    this.privacyType = props.privacyType;
    this.entryDeadline = props.entryDeadline;
    this.maxMembers = props.maxMembers;
    this.entryFee = props.entryFee;
    this.hasPrize = props.hasPrize;
    this.isActive = isActive ?? true;
  }
}