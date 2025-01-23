import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { PetOutput, PetOutputMapper } from '../dtos/pet-output'

export namespace GetPetUseCase {
  export type Input = { id: number }

  export type Output = PetOutput | null

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly petRepository: PetRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const pet = await this.petRepository.findById(input.id)
      if (!pet) return null
      return PetOutputMapper.toOutput(pet)
    }
  }
}
