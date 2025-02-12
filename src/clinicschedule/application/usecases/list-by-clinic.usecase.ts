import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

import { ClinicScheduleRepository } from '@/clinicschedule/domain/repositories/clinic-schedule.repository'
import {
  ClinicScheduleOutput,
  ClinicScheduleOutputMapper,
} from '../dtos/clinic.output'

export namespace ListSchedulesByClinicUseCase {
  export type Input = { clinicId: number }

  export type Output = ClinicScheduleOutput[]

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly clinicScheduleRepository: ClinicScheduleRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const clinicSchedules =
        await this.clinicScheduleRepository.listByClinicId(input.clinicId)
      return clinicSchedules.map(clinicSchedule =>
        ClinicScheduleOutputMapper.toOutput(clinicSchedule),
      )
    }
  }
}
