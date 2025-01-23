import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UpdatePasswordUseCase } from '../../update-password.usecase'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { hash } from 'crypto'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('UpdatePasswordUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UpdatePasswordUseCase.UseCase
  let repository: UserPrismaRepository
  let module: TestingModule
  let hashProvider: HashProvider

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    repository = new UserPrismaRepository(prismaService as any)
    hashProvider = new BcryptjsHashProvider()
  })

  beforeEach(async () => {
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws error when entity not found', async () => {
    expect(
      sut.execute({
        id: 5434,
        password: 'any_name',
        oldPassword: 'old',
      }),
    ).rejects.toThrow(new NotFoundError(`UserModel not found using ID 5434`))
  })

  it('should throws error when old password is invalid', async () => {
    const entity = new UserEntity(UserDataBuilder({}), 1)
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: 'old',
        password: 'new',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'))
  })

  it('should throws error when old password or new password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}), 1)
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: '',
        password: 'new',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: 'old',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: '',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
  })

  it('should update a password', async () => {
    const oldPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }), 1)
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({
      id: entity.id,
      oldPassword: '1234',
      password: 'newpassword',
    })

    const result = hashProvider.compareHash('newpassword', output.password)

    await expect(result).toBeTruthy()
  })
})
