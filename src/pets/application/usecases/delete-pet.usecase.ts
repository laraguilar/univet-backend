import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { PetRepository } from '@/pets/domain/repositories/pet.repository'

export namespace DeletePetUseCase {
  export type Input = {
    id: number
  }

  export type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly petRepository: PetRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input
      await this.petRepository.delete(id)
    }
  }
}
