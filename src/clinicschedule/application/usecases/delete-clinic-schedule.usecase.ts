import { ClinicRepository } from '@/clinic/domain/repositories/clinic.repository'
import { ClinicScheduleRepository } from '@/clinicschedule/domain/repositories/clinic-schedule.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace DeleteClinicScheduleUseCase {
  export type Input = {
    id: number
  }

  export type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly clinicScheduleRepository: ClinicScheduleRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input
      await this.clinicScheduleRepository.delete(id)
    }
  }
}
