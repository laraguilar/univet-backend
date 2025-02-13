import { AppointmentEntity } from '@/appointment/domain/entities/appointment.entity'
import { AppointmentRepository } from '@/appointment/domain/repositories/appointment.repository'
import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

export namespace GetAppointmentsByOwnerUseCase {
  export type Input = {
    ownerId: number
  }

  export type Output = AppointmentEntity[]

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly appointmentRepository: AppointmentRepository.Repository,
      private readonly petRepository: PetRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { ownerId } = input
      console.log('GET Appointments By Owner - input', input)

      // Buscar todos os pets do dono pelo ID
      const pets = await this.petRepository.findByOwner(ownerId)
      if (!pets || pets.length === 0) {
        throw new NotFoundError(`No pets found for owner with ID ${ownerId}`)
      }

      // Coletar os IDs dos pets
      const petIds = pets.map(pet => pet.id)

      // Buscar os appointments relacionados aos pets encontrados
      const appointments = await this.appointmentRepository.findByPetIds(petIds)
      if (!appointments || appointments.length === 0) {
        throw new NotFoundError(
          `No appointments found for pets of owner with ID ${ownerId}`,
        )
      }

      // Retornar a lista de appointments encontrados
      return appointments
    }
  }
}
