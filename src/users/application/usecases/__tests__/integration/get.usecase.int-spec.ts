import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { GetUserUseCase } from '../../get-user.usecase'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('GetUserUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: GetUserUseCase.UseCase
  let repository: UserPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    repository = new UserPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new GetUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws error when entity not found', async () => {
    expect(sut.execute({ id: 2332 })).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID 2332`),
    )
  })

  it('should get a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}), 1)
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({ id: entity.id })
    expect(output).toMatchObject(model)
  })
})
