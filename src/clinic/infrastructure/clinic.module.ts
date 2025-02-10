import { Module } from '@nestjs/common'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { CreateClinicUseCase } from '../application/usecases/create-clinic.usecase'
import { ClinicRepository } from '../domain/repositories/clinic.repository'
import { DeleteClinicUseCase } from '../application/usecases/delete-clinic.usecase'
import { GetClinicUseCase } from '../application/usecases/get-clinic.usecase'
import { ListClinicsUseCase } from '../application/usecases/list-clinics.usecase'
import { ClinicPrismaRepository } from './database/prisma/repositories/clinic-prisma.repository'
import { ClinicController } from './clinic.controller'

@Module({
  controllers: [ClinicController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'ClinicRepository',
      useFactory: (prismaService: PrismaService) => {
        return new ClinicPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreateClinicUseCase.UseCase,
      useFactory: (clinicRepository: ClinicRepository.Repository) => {
        return new CreateClinicUseCase.UseCase(clinicRepository)
      },
      inject: ['ClinicRepository', 'UserRepository'],
    },
    {
      provide: DeleteClinicUseCase.UseCase,
      useFactory: (petRepository: ClinicRepository.Repository) => {
        return new DeleteClinicUseCase.UseCase(petRepository)
      },
      inject: ['ClinicRepository'],
    },
    {
      provide: GetClinicUseCase.UseCase,
      useFactory: (petRepository: ClinicRepository.Repository) => {
        return new GetClinicUseCase.UseCase(petRepository)
      },
      inject: ['ClinicRepository'],
    },

    {
      provide: ListClinicsUseCase.UseCase,
      useFactory: (petRepository: ClinicRepository.Repository) => {
        return new ListClinicsUseCase.UseCase(petRepository)
      },
      inject: ['ClinicRepository'],
    },
  ],
})
export class PetsModule {}
