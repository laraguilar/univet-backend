import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { PetOutputMapper } from '../dtos/pet-output'

export namespace CreatePetUseCase {
  export type Input = {
    name: string
    species: string
    breed: string
    birthDate: Date
    ownerId: number
  }

  export type Output = {
    id: number
    name: string
    species: string
    breed: string
    birthDate: Date
    ownerId: number
  }

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly petRepository: PetRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { name, species, breed, birthDate, ownerId } = input

      // Validação dos dados de entrada
      if (!name || !species || !breed || !birthDate || !ownerId) {
        throw new BadRequestError('Input data not provided')
      }

      // Validação adicional se necessário, por exemplo, verificar se o pet já existe
      // await this.petRepository.findByName(name) // Se quiser verificar se já existe um pet com o mesmo nome

      // Criação da entidade Pet
      const entity = new PetEntity(input)

      // Inserção do pet no repositório
      const newPet = await this.petRepository.insert(entity)

      // Retorno dos dados do pet recém-criado
      return PetOutputMapper.toOutput(newPet)
    }
  }
}
