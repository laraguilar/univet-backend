import { Module } from '@nestjs/common'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { AppointmentController } from './appointment.controller'
import { AppointmentPrismaRepository } from './database/prisma/repositories/appointment-prisma.repository'
import { PetPrismaRepository } from '@/pets/infrastructure/database/prisma/repositories/pet-prisma.repository'
import { CreateAppointmentUseCase } from '../application/usecases/create-appointment.usecase'
import { AppointmentRepository } from '../domain/repositories/appointment.repository'
import { DeleteAppointmentUseCase } from '../application/usecases/delete-appointment.usecase'
import { UpdateAppointmentStatusUseCase } from '../application/usecases/update-status.usecase'
import { GetAppointmentsByOwnerUseCase } from '../application/usecases/get-by-pet-owner.usecase'
import { PetRepository } from '@/pets/domain/repositories/pet.repository'

@Module({
  controllers: [AppointmentController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'AppointmentRepository',
      useFactory: (prismaService: PrismaService) => {
        return new AppointmentPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'PetRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PetPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreateAppointmentUseCase.UseCase,
      useFactory: (AppointmentRepository: AppointmentRepository.Repository) => {
        return new CreateAppointmentUseCase.UseCase(AppointmentRepository)
      },
      inject: ['AppointmentRepository'],
    },
    {
      provide: DeleteAppointmentUseCase.UseCase,
      useFactory: (appointmentRepository: AppointmentRepository.Repository) => {
        return new DeleteAppointmentUseCase.UseCase(appointmentRepository)
      },
      inject: ['AppointmentRepository'],
    },
    {
      provide: UpdateAppointmentStatusUseCase.UseCase,
      useFactory: (appointmentRepository: AppointmentRepository.Repository) => {
        return new UpdateAppointmentStatusUseCase.UseCase(appointmentRepository)
      },
      inject: ['AppointmentRepository'],
    },
    {
      provide: GetAppointmentsByOwnerUseCase.UseCase,
      useFactory: (
        appointmentRepository: AppointmentRepository.Repository,
        petRepository: PetRepository.Repository,
      ) => {
        return new GetAppointmentsByOwnerUseCase.UseCase(
          appointmentRepository,
          petRepository,
        )
      },
      inject: ['AppointmentRepository', 'PetRepository'],
    },
  ],
})
export class AppointmentModule {}
