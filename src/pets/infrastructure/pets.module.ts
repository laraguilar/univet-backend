import { Module } from '@nestjs/common'
import { PetsController } from './pets.controller'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { CreatePetUseCase } from '../application/usecases/create-pet.usecase'
import { PetRepository } from '../domain/repositories/pet.repository'
import { PetPrismaRepository } from './database/prisma/repositories/pet-prisma.repository'
import { DeletePetUseCase } from '../application/usecases/delete-pet.usecase'
import { GetPetUseCase } from '../application/usecases/get-pet.usecase'
import { GetPetsByOwnerUseCase } from '../application/usecases/get-pets-by-owner'
import { ListPetsUseCase } from '../application/usecases/list-pets.usecase'
import { UpdatePetUseCase } from '../application/usecases/update-pet.usecase'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'

@Module({
  controllers: [PetsController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'PetRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PetPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreatePetUseCase.UseCase,
      useFactory: (
        petRepository: PetRepository.Repository,
        userRepository: UserRepository.Repository,
      ) => {
        return new CreatePetUseCase.UseCase(petRepository, userRepository)
      },
      inject: ['PetRepository', 'UserRepository'],
    },
    {
      provide: DeletePetUseCase.UseCase,
      useFactory: (petRepository: PetRepository.Repository) => {
        return new DeletePetUseCase.UseCase(petRepository)
      },
      inject: ['PetRepository'],
    },
    {
      provide: GetPetUseCase.UseCase,
      useFactory: (petRepository: PetRepository.Repository) => {
        return new GetPetUseCase.UseCase(petRepository)
      },
      inject: ['PetRepository'],
    },
    {
      provide: GetPetsByOwnerUseCase.UseCase,
      useFactory: (petRepository: PetRepository.Repository) => {
        return new GetPetsByOwnerUseCase.UseCase(petRepository)
      },
      inject: ['PetRepository'],
    },
    {
      provide: ListPetsUseCase.UseCase,
      useFactory: (petRepository: PetRepository.Repository) => {
        return new ListPetsUseCase.UseCase(petRepository)
      },
      inject: ['PetRepository'],
    },
    {
      provide: UpdatePetUseCase.UseCase,
      useFactory: (petRepository: PetRepository.Repository) => {
        return new UpdatePetUseCase.UseCase(petRepository)
      },
      inject: ['PetRepository'],
    },
  ],
})
export class PetsModule {}
