import { AppointmentEntity } from '@/appointment/domain/entities/appointment.entity'
import { AppointmentRepository } from '@/appointment/domain/repositories/appointment.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import {
  AppointmentOutput,
  AppointmentOutputMapper,
} from '../dtos/appointment.output'

export namespace UpdateAppointmentStatusUseCase {
  export type Input = {
    id: number
    status: string
  }

  export type Output = AppointmentOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly appointmentRepository: AppointmentRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { id, status } = input
      console.log('UPDATE Appointment Status - input', input)

      // Validação do status
      if (!status) {
        throw new BadRequestError('Status is required')
      }

      // Buscar o agendamento pelo ID
      const appointment = await this.appointmentRepository.findById(id)
      if (!appointment) {
        throw new NotFoundError(`Appointment not found with ID ${id}`)
      }

      // Atualizar o status do agendamento
      appointment.updateStatus(status)

      // Salvar as alterações no repositório
      await this.appointmentRepository.update(appointment)

      console.log('UPDATE Appointment Status - success')
      // Retornar o output do agendamento atualizado
      return AppointmentOutputMapper.toOutput(appointment)
    }
  }
}
