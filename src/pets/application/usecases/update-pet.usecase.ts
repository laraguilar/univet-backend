import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { PetProps } from '@/pets/domain/entities/pet.entity'
import { PetOutput, PetOutputMapper } from '../dtos/pet-output'

export namespace UpdatePetUseCase {
  export type Input = {
    id: number
    name?: string
    breed?: string
    weight?: number
  }

  export type Output = PetOutput

  export class UseCase {
    constructor(private readonly petRepository: PetRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { id, name, breed, weight } = input
      console.log('UPDATE Pets - input', input)
      // Validação do ID
      if (!id) {
        throw new Error('Pet ID is required')
      }

      // Busca o pet pelo ID
      const entity = await this.petRepository.findById(id)

      // Atualiza somente os campos fornecidos
      const updatedProps: Partial<PetProps> = {}
      if (name) updatedProps.name = name
      if (breed) updatedProps.breed = breed
      if (weight) updatedProps.weight = weight

      entity.update(updatedProps)
      await this.petRepository.update(entity)

      return PetOutputMapper.toOutput(entity)
    }
  }
}
