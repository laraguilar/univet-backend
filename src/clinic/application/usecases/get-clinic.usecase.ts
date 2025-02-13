import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { ClinicOutput, ClinicOutputMapper } from '../dtos/clinic.output'
import { ClinicRepository } from '@/clinic/domain/repositories/clinic.repository'

export namespace GetClinicUseCase {
  export type Input = { id: number }

  export type Output = ClinicOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly clinicRepository: ClinicRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const pet = await this.clinicRepository.findById(input.id)
      return ClinicOutputMapper.toOutput(pet)
    }
  }
}
