import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { SignUpUseCase } from '../../sign-up.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('SignUpUseCase unit tests', () => {
  let sut: SignUpUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SignUpUseCase.UseCase(repository, hashProvider)
  })

  it('Should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = UserDataBuilder({})
    const result = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    })
    expect(result.id).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('Should not be able to register with same email twice', async () => {
    const props = UserDataBuilder({ email: 'a@a.com' })
    const result = await sut.execute(props)

    await expect(sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('Should throw error when name not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { name: null })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when email not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { email: null })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when password not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { password: null })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })
})
