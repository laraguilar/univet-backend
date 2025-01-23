import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { PetOutput, PetOutputMapper } from '../dtos/pet-output'

export namespace GetPetsByOwnerUseCase {
  export type Input = { ownerId: number }

  export type Output = PetOutput[]

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly petRepository: PetRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const pets = await this.petRepository.findByOwner(input.ownerId)
      return pets.map(pet => PetOutputMapper.toOutput(pet))
    }
  }
}
