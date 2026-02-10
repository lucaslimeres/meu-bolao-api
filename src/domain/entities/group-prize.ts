export class GroupPrize {
  public readonly groupId: string;
  public firstPlacePct: number;
  public secondPlacePct: number;
  public thirdPlacePct: number;

  constructor(props: GroupPrize) {
    this.groupId = props.groupId;
    this.firstPlacePct = props.firstPlacePct || 0;
    this.secondPlacePct = props.secondPlacePct || 0;
    this.thirdPlacePct = props.thirdPlacePct || 0;
  }
}