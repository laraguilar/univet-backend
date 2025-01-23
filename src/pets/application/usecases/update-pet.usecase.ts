import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { PetProps } from '@/pets/domain/entities/pet.entity'
import { PetOutput, PetOutputMapper } from '../dtos/pet-output'

export namespace UpdatePetUseCase {
  export type Input = {
    id: number
    key: string
    value: string | number
  }

  export type Output = PetOutput

  export class UseCase {
    constructor(private readonly petRepository: PetRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { id, key, value } = input
      // Busca o pet pelo ID
      if (!id || !key || !value) {
        throw new Error('Input data not provided')
      }

      const entity = await this.petRepository.findById(id)
      entity.update(key as keyof PetProps, value)
      await this.petRepository.update(entity)

      return PetOutputMapper.toOutput(entity)
    }
  }
}
