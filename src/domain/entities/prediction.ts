export class Prediction {
  public readonly id?: number;
  public userId: string;
  public groupId: string;
  public matchId: number;
  public homeGuess: number;
  public awayGuess: number;
  public pointsEarned: number;

  constructor(props: Omit<Prediction, "id">, id?: number) {
    this.id = id;
    this.userId = props.userId;
    this.groupId = props.groupId;
    this.matchId = props.matchId;
    this.homeGuess = props.homeGuess;
    this.awayGuess = props.awayGuess;
    this.pointsEarned = props.pointsEarned || 0;
  }
}