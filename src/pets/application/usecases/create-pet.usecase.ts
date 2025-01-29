import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { PetOutput, PetOutputMapper } from '../dtos/pet-output'
import { UserRepository } from '@/users/domain/repositories/user.repository'

export namespace CreatePetUseCase {
  export type Input = {
    name: string
    species: string
    breed: string
    birthDate: Date
    weight?: number
    ownerId: number
  }

  export type Output = PetOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly petRepository: PetRepository.Repository,
      private readonly userRepository: UserRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { name, species, breed, birthDate, ownerId, weight } = input
      console.log('CREATE Pets - input', input)
      // Validação dos dados de entrada
      if (!name || !species || !breed || !birthDate || !ownerId) {
        throw new BadRequestError('Input data not provided')
      }

      await this.userRepository.findById(ownerId) // Verifica se o dono do pet existe

      // Validação adicional se necessário, por exemplo, verificar se o pet já existe
      // await this.petRepository.findByName(name) // Se quiser verificar se já existe um pet com o mesmo nome

      // Criação da entidade Pet
      const entity = new PetEntity({
        ...input,
        birthDate: new Date(birthDate),
      })
      console.log('CREATE Pets - entity', entity)

      // Inserção do pet no repositório
      const newPet = await this.petRepository.insert(entity)

      // Retorno dos dados do pet recém-criado
      return PetOutputMapper.toOutput(newPet)
    }
  }
}
