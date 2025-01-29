import { CreatePetUseCase } from '../../create-pet.usecase'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { PetInMemoryRepository } from '@/pets/infrastructure/database/in-memory/repositories/pet-in-memory.repository'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'

describe('CreatePetUseCase unit tests', () => {
  let sut: CreatePetUseCase.UseCase
  let repository: PetInMemoryRepository
  let userRepository: UserInMemoryRepository

  beforeEach(() => {
    repository = new PetInMemoryRepository()
    userRepository = new UserInMemoryRepository()
    sut = new CreatePetUseCase.UseCase(repository, userRepository)
  })

  it('Should create a pet', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')

    const user = new UserEntity(UserDataBuilder({ name: 'John Doe' }), 1)
    await userRepository.insert(user)

    const props = PetDataBuilder({ ownerId: user.id })
    const result = await sut.execute({
      name: props.name,
      species: props.species,
      breed: props.breed,
      birthDate: props.birthDate,
      ownerId: props.ownerId,
    })
    expect(result.id).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('Should create a pet with weight', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const user = new UserEntity(UserDataBuilder({ name: 'John Doe' }), 1)
    await userRepository.insert(user)

    const props = PetDataBuilder({ ownerId: user.id })
    const result = await sut.execute({
      name: props.name,
      species: props.species,
      breed: props.breed,
      birthDate: props.birthDate,
      ownerId: props.ownerId,
      weight: props.weight,
    })
    expect(result.id).toBeDefined()
    expect(result.weight).toBe(props.weight)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  // it('Should not be able to register a pet with same name for the same owner', async () => {
  //   const props = PetDataBuilder({ name: 'Fluffy', ownerId: 1 })
  //   await sut.execute({
  //     name: props.name,
  //     species: props.species,
  //     breed: props.breed,
  //     birthDate: props.birthDate,
  //     ownerId: props.ownerId,
  //   })

  //   const duplicatePetProps = PetDataBuilder({ name: 'Fluffy', ownerId: 1 })
  //   await expect(
  //     sut.execute({
  //       name: duplicatePetProps.name,
  //       species: duplicatePetProps.species,
  //       breed: duplicatePetProps.breed,
  //       birthDate: duplicatePetProps.birthDate,
  //       ownerId: duplicatePetProps.ownerId,
  //     }),
  //   ).rejects.toBeInstanceOf(ConflictError)
  // })

  it('Should throw error when name not provided', async () => {
    const user = new UserEntity(UserDataBuilder({ name: 'John Doe' }), 1)
    await userRepository.insert(user)

    const props = PetDataBuilder({ ownerId: user.id })
    await expect(
      sut.execute({
        name: null,
        species: props.species,
        breed: props.breed,
        birthDate: props.birthDate,
        ownerId: props.ownerId,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when species not provided', async () => {
    const user = new UserEntity(UserDataBuilder({ name: 'John Doe' }), 1)
    await userRepository.insert(user)

    const props = Object.assign(PetDataBuilder({ ownerId: user.id }), {
      species: null,
    })

    await expect(
      sut.execute({
        name: props.name,
        species: null,
        breed: props.breed,
        birthDate: props.birthDate,
        ownerId: props.ownerId,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when breed not provided', async () => {
    const user = new UserEntity(UserDataBuilder({ name: 'John Doe' }), 1)
    await userRepository.insert(user)

    const props = Object.assign(PetDataBuilder({ ownerId: user.id }), {
      breed: null,
    })

    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when birthDate not provided', async () => {
    const user = new UserEntity(UserDataBuilder({ name: 'John Doe' }), 1)
    await userRepository.insert(user)

    const props = Object.assign(PetDataBuilder({ ownerId: user.id }), {
      birthDate: null,
    })

    await expect(
      sut.execute({
        name: props.name,
        species: props.species,
        breed: props.breed,
        birthDate: null,
        ownerId: props.ownerId,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when ownerId not provided', async () => {
    const user = new UserEntity(UserDataBuilder({ name: 'John Doe' }), 1)
    await userRepository.insert(user)

    const props = Object.assign(PetDataBuilder({ ownerId: user.id }), {
      ownerId: null,
    })

    await expect(
      sut.execute({
        name: props.name,
        species: props.species,
        breed: props.breed,
        birthDate: props.birthDate,
        ownerId: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })
})
