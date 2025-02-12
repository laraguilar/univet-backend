import { ClinicScheduleRepository } from '@/clinicschedule/domain/repositories/clinic-schedule.repository'
import {
  ClinicScheduleOutput,
  ClinicScheduleOutputMapper,
} from '../dtos/clinic.output'
import { ClinicScheduleProps } from '@/clinicschedule/domain/entities/clinic-schedule.entity'

export namespace UpdateClinicScheduleUseCase {
  export type Input = {
    id: number
    openTime?: string
    closeTime?: string
  }

  export type Output = ClinicScheduleOutput

  export class UseCase {
    constructor(
      private readonly clinicScheduleRepository: ClinicScheduleRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { id, openTime, closeTime } = input
      console.log('UPDATE Clinic Schedule - input', input)
      // Validação do ID
      if (!id) {
        throw new Error('ClinicSchedule ID is required')
      }

      const entity = await this.clinicScheduleRepository.findById(id)

      // Atualiza somente os campos fornecidos
      const updatedProps: Partial<ClinicScheduleProps> = {}
      if (openTime) updatedProps.openTime = openTime
      if (closeTime) updatedProps.closeTime = closeTime

      entity.update(updatedProps)
      await this.clinicScheduleRepository.update(entity)

      return ClinicScheduleOutputMapper.toOutput(entity)
    }
  }
}
