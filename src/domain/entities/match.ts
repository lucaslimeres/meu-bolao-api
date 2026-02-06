export type MatchStatus = 'scheduled' | 'ongoing' | 'finished';

export class Match {
  public readonly id?: number;
  public championshipId: number;
  public homeTeamId: number;
  public awayTeamId: number;
  public matchDate: Date;
  public homeScore?: number;
  public awayScore?: number;
  public status: MatchStatus;

  constructor(props: Omit<Match, "id">, id?: number) {
    this.id = id;
    this.championshipId = props.championshipId;
    this.homeTeamId = props.homeTeamId;
    this.awayTeamId = props.awayTeamId;
    this.matchDate = props.matchDate;
    this.homeScore = props.homeScore;
    this.awayScore = props.awayScore;
    this.status = props.status || 'scheduled';
  }
}