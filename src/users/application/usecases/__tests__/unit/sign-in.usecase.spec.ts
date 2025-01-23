import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { SignInUseCase } from '../../sign-in.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

describe('SignInUseCase unit tests', () => {
  let sut: SignInUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SignInUseCase.UseCase(repository, hashProvider)
  })

  it('Should authenticate a user', async () => {
    const spyFindEmail = jest.spyOn(repository, 'findByEmail')
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    repository.setItems([entity])

    const result = await sut.execute({
      email: entity.email,
      password: '1234',
    })

    expect(result).toMatchObject({ email: 'a@a.com', password: hashPassword })
    expect(spyFindEmail).toHaveBeenCalledTimes(1)
  })

  it('Should throw error when email not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), {
      email: null,
      password: '1234',
    })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when password not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), {
      email: 'a@a.com',
      password: null,
    })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should not be able to authenticate with wrong email', async () => {
    const props = {
      email: 'b@b.com',
      password: '1234',
    }
    await expect(sut.execute(props)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('Should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const spyFindEmail = jest.spyOn(repository, 'findByEmail')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    repository.setItems([entity])

    await expect(
      sut.execute({ email: entity.email, password: '7832' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)

    expect(spyFindEmail).toHaveBeenCalledTimes(1)
  })
})
