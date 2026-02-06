import { Championship } from "@/domain/entities/championship";
import { IChampionshipRepository } from "@/domain/repositories";

interface CreateChampionshipRequest {
  title: string;
  description?: string;
}

export class CreateChampionshipUseCase {
  constructor(private championshipRepository: IChampionshipRepository) {}

  async execute({ title, description }: CreateChampionshipRequest) {
    const championship = new Championship({
      title,
      description,
      isActive: true
    });

    await this.championshipRepository.create(championship);
    return championship;
  }
}
