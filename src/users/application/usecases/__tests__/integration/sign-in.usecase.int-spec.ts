import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { SignInUseCase } from '../../sign-in.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('SignInUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: SignInUseCase.UseCase
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
    sut = new SignInUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws error when email not provided', async () => {
    expect(sut.execute({ email: '', password: '1234' })).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    )
  })
  it('should throws error when password not provided', async () => {
    expect(
      sut.execute({ email: 'email@email.com', password: '' }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }))
    expect(
      sut.execute({ email: 'a@a.com', password: hashPassword }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel not found using email a@a.com`),
    )
  })

  it('should not be able to authenticate with wrong password', async () => {
    const password = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password }),
      1,
    )
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })
    expect(
      sut.execute({ email: 'a@a.com', password: 'invalid' }),
    ).rejects.toThrow(new InvalidCredentialsError('Invalid credentials'))
  })

  it('should authenticate a user', async () => {
    const password = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password }),
      1,
    )
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({ email: 'a@a.com', password: '1234' })

    expect(output.id).toBe(model.id)
    expect(output).toMatchObject(entity.toJSON())
  })
})
