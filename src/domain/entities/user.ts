export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public passwordHash: string;
  public createdAt: Date;

  constructor(props: Omit<User, "id" | "createdAt">, id: string, createdAt?: Date) {
    this.id = id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.createdAt = createdAt || new Date();
  }
}