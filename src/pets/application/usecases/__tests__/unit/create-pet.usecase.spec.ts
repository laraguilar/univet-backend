import { CreatePetUseCase } from '../../create-pet.usecase'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { PetInMemoryRepository } from '@/pets/infrastructure/database/in-memory/repositories/pet-in-memory.repository'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('CreatePetUseCase unit tests', () => {
  let sut: CreatePetUseCase.UseCase
  let repository: PetInMemoryRepository

  beforeEach(() => {
    repository = new PetInMemoryRepository()
    sut = new CreatePetUseCase.UseCase(repository)
  })

  it('Should create a pet', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = PetDataBuilder({})
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
    const props = PetDataBuilder({})

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
    const props = Object.assign(PetDataBuilder({}), { species: null })
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
    const props = Object.assign(PetDataBuilder({}), { breed: null })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when birthDate not provided', async () => {
    const props = Object.assign(PetDataBuilder({}), { birthDate: null })
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
    const props = Object.assign(PetDataBuilder({}), { ownerId: null })
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
