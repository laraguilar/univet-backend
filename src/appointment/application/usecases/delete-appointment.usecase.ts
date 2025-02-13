import { AppointmentRepository } from '@/appointment/domain/repositories/appointment.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace DeleteAppointmentUseCase {
  export type Input = {
    id: number
  }

  export type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly appointmentRepository: AppointmentRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input
      await this.appointmentRepository.delete(id)
    }
  }
}
