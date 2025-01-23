import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UpdateUserUseCase } from '../../update-user.usecase'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('UpdateUserUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UpdateUserUseCase.UseCase
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
    sut = new UpdateUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws error when entity not found', async () => {
    expect(sut.execute({ id: 2143, name: 'any_name' })).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID 2143`),
    )
  })

  it('should udate a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}), 1)
    const model = await prismaService.user.create({
      data: {
        id: entity.id,
        name: entity.name,
        email: entity.email,
        password: entity.password,
      },
    })

    await sut.execute({ id: entity.id, name: 'new_name' })
    const output = await prismaService.user.findUnique({
      where: { id: model.id },
    })

    expect(output.name).toBe('new_name')
  })
})
