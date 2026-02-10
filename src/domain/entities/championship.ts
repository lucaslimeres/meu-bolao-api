export type ChampionshipStatus = 'active' | 'finished';

export class Championship {
  public readonly id?: number;
  public title: string;
  public description?: string;
  public isActive: boolean;
  public status: ChampionshipStatus;

  constructor(props: Omit<Championship, "id">, id?: number) {
    this.id = id;
    this.title = props.title;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.status = props.status || 'active';
  }
}