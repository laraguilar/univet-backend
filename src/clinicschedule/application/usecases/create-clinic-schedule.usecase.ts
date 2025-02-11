import { ClinicScheduleRepository } from '@/clinicschedule/domain/repositories/clinic-schedule.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import {
  ClinicScheduleOutput,
  ClinicScheduleOutputMapper,
} from '../dtos/clinic.output'

export namespace CreateClinicScheduleUseCase {
  export type Input = {
    dayOfWeek: number
    openTime: string
    closeTime: string
    clinicId: number
  }

  export type Output = ClinicScheduleOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly clinicScheduleRepository: ClinicScheduleRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { dayOfWeek, openTime, closeTime, clinicId } = input
      console.log('CREATE Clinic Schedule - input', input)

      // Validacao dos dados de entrada
      if (!dayOfWeek || !openTime || !closeTime || !clinicId) {
        throw new BadRequestError('Input data not provided')
      }

      // Criacao da entidade Clinic
      const entity = new ClinicScheduleEntity({
        ...input,
      })
      console.log('CREATE Clinic Schedule - entity', entity)

      // Insercao da clinica no repositorio
      const newClinic = await this.clinicScheduleRepository.insert(entity)

      // Retorno dos dados da clinica recem-criada
      return ClinicScheduleOutputMapper.toOutput(newClinic)
    }
  }
}
