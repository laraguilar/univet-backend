import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

import { ClinicScheduleRepository } from '@/clinicschedule/domain/repositories/clinic-schedule.repository'
import {
  ClinicScheduleOutput,
  ClinicScheduleOutputMapper,
} from '../dtos/clinic.output'

export namespace GetClinicScheduleUseCase {
  export type Input = { id: number }

  export type Output = ClinicScheduleOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly clinicScheduleRepository: ClinicScheduleRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const pet = await this.clinicScheduleRepository.findById(input.id)
      return ClinicScheduleOutputMapper.toOutput(pet)
    }
  }
}
