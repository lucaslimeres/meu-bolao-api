export class Championship {
  public readonly id?: number;
  public title: string;
  public description?: string;
  public isActive: boolean;

  constructor(props: Omit<Championship, "id">, id?: number) {
    this.id = id;
    this.title = props.title;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
  }
}