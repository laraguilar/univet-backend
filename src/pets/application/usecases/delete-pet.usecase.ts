import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

export class DeletePetUseCase {
  constructor(private petRepository: PetRepository.Repository) {}

  async execute(petId: number): Promise<void> {
    await this.petRepository.delete(petId)
  }
}
