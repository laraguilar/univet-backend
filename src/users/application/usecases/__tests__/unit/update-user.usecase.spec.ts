import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UpdateUserUseCase } from '../../update-user.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new UpdateUserUseCase.UseCase(repository)
  })

  it('Should throw error when entity not found', async () => {
    await expect(sut.execute({ id: 3234, name: 'test name' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should throw error when name is not provided', async () => {
    await expect(sut.execute({ id: 3234, name: '' })).rejects.toThrow(
      new BadRequestError('Name not provided'),
    )
  })

  it('Should update a user', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const items = [new UserEntity(UserDataBuilder({}), 1)]
    repository.setItems(items)

    const result = await sut.execute({ id: items[0].id, name: 'new name' })
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      id: items[0].id,
      name: 'new name',
      password: items[0].password,
      email: items[0].email,
      createdAt: items[0].createdAt,
    })
  })
})
