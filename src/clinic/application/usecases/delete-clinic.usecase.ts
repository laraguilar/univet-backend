import { ClinicRepository } from '@/clinic/domain/repositories/clinic.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace DeleteClinicUseCase {
  export type Input = {
    id: number
  }

  export type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly clinicRepository: ClinicRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input
      await this.clinicRepository.delete(id)
    }
  }
}
