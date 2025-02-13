import { AppointmentEntity } from '@/appointment/domain/entities/appointment.entity'
import { AppointmentRepository } from '@/appointment/domain/repositories/appointment.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import {
  AppointmentOutput,
  AppointmentOutputMapper,
} from '../dtos/appointment.output'

export namespace CreateAppointmentUseCase {
  export type Input = {
    date: Date
    status: string
    clinicId: number
    petId: number
  }

  export type Output = AppointmentOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly appointmentRepository: AppointmentRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { date, status, clinicId, petId } = input
      console.log('CREATE Appointment - input', input)

      // Validação dos dados de entrada
      if (!date || !status || !clinicId || !petId) {
        throw new BadRequestError('Input data not provided')
      }

      // Criação da entidade Appointment
      const entity = new AppointmentEntity({
        date,
        status,
        clinicId,
        petId,
      })
      console.log('CREATE Appointment - entity', entity)

      // Inserção do agendamento no repositório
      const newAppointment = await this.appointmentRepository.insert(entity)

      // Retorno dos dados do agendamento recém-criado
      return AppointmentOutputMapper.toOutput(newAppointment)
    }
  }
}
