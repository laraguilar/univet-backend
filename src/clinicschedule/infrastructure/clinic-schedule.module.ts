import { Module } from '@nestjs/common'
import { ClinicScheduleController } from './clinic-schedule.controller'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { ClinicScheduleRepository } from '../domain/repositories/clinic-schedule.repository'
import { ClinicSchedulePrismaRepository } from './database/prisma/repositories/clinic-schedule-prisma.repository'
import { CreateClinicScheduleUseCase } from '../application/usecases/create-clinic-schedule.usecase'
import { DeleteClinicScheduleUseCase } from '../application/usecases/delete-clinic-schedule.usecase'
import { GetClinicScheduleUseCase } from '../application/usecases/get-clinic-schedule.usecase'
import { UpdateClinicScheduleUseCase } from '../application/usecases/update-clinic-schedule.usecase'
import { ListClinicsScheduleUseCase } from '../application/usecases/list-clinics-schedule.usecase'
import { ListSchedulesByClinicUseCase } from '../application/usecases/list-by-clinic.usecase'

@Module({
  controllers: [ClinicScheduleController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'ClinicScheduleRepository',
      useFactory: (prismaService: PrismaService) => {
        return new ClinicSchedulePrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreateClinicScheduleUseCase.UseCase,
      useFactory: (
        clinicScheduleRepository: ClinicScheduleRepository.Repository,
      ) => {
        return new CreateClinicScheduleUseCase.UseCase(clinicScheduleRepository)
      },
      inject: ['ClinicScheduleRepository'],
    },
    {
      provide: DeleteClinicScheduleUseCase.UseCase,
      useFactory: (
        clinicScheduleRepository: ClinicScheduleRepository.Repository,
      ) => {
        return new DeleteClinicScheduleUseCase.UseCase(clinicScheduleRepository)
      },
      inject: ['ClinicScheduleRepository'],
    },
    {
      provide: GetClinicScheduleUseCase.UseCase,
      useFactory: (
        clinicScheduleRepository: ClinicScheduleRepository.Repository,
      ) => {
        return new GetClinicScheduleUseCase.UseCase(clinicScheduleRepository)
      },
      inject: ['ClinicScheduleRepository'],
    },
    {
      provide: ListClinicsScheduleUseCase.UseCase,
      useFactory: (
        clinicScheduleRepository: ClinicScheduleRepository.Repository,
      ) => {
        return new ListClinicsScheduleUseCase.UseCase(clinicScheduleRepository)
      },
      inject: ['ClinicScheduleRepository'],
    },
    {
      provide: ListSchedulesByClinicUseCase.UseCase,
      useFactory: (
        clinicScheduleRepository: ClinicScheduleRepository.Repository,
      ) => {
        return new ListSchedulesByClinicUseCase.UseCase(
          clinicScheduleRepository,
        )
      },
      inject: ['ClinicScheduleRepository'],
    },
    {
      provide: UpdateClinicScheduleUseCase.UseCase,
      useFactory: (
        clinicScheduleRepository: ClinicScheduleRepository.Repository,
      ) => {
        return new UpdateClinicScheduleUseCase.UseCase(clinicScheduleRepository)
      },
      inject: ['ClinicScheduleRepository'],
    },
  ],
})
export class ClinicScheduleModule {}
