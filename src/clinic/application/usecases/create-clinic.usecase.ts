import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'
import { ClinicRepository } from '@/clinic/domain/repositories/clinic.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { ClinicOutput, ClinicOutputMapper } from '../dtos/clinic.output'

export namespace CreateClinicUseCase {
  export type Input = {
    name: string
    cnpj: string
    zipCode: string
    street: string
    number: number
    neighborhood: string
    city: string
    state: string
    phone?: string
  }

  export type Output = ClinicOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly clinicRepository: ClinicRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const {
        name,
        cnpj,
        zipCode,
        street,
        number,
        neighborhood,
        city,
        state,
        phone,
      } = input
      console.log('CREATE Clinic - input', input)

      // Validação dos dados de entrada
      if (
        !name ||
        !cnpj ||
        !zipCode ||
        !street ||
        !number ||
        !neighborhood ||
        !city ||
        !state
      ) {
        throw new BadRequestError('Input data not provided')
      }

      // Criação da entidade Clinic
      const entity = new ClinicEntity({
        ...input,
      })
      console.log('CREATE Clinic - entity', entity)

      // Inserção da clínica no repositório
      const newClinic = await this.clinicRepository.insert(entity)

      // Retorno dos dados da clínica recém-criada
      return ClinicOutputMapper.toOutput(newClinic)
    }
  }
}
