import { PetInMemoryRepository } from '@/pets/infrastructure/database/in-memory/repositories/pet-in-memory.repository'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { GetPetsByOwnerUseCase } from '../../get-pets-by-owner'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

describe('GetPetsByOwnerUseCase unit tests', () => {
  let sut: GetPetsByOwnerUseCase.UseCase
  let repository: PetInMemoryRepository

  beforeEach(() => {
    repository = new PetInMemoryRepository()
    sut = new GetPetsByOwnerUseCase.UseCase(repository)
  })

  it('should return an empty list when no pets are found for the given ownerId', async () => {
    expect(sut.execute({ ownerId: 1 })).rejects.toThrow(
      new NotFoundError(`No pets found for owner with ID: 1`),
    )
  })

  it('should return a list of pets when pets are found for the given ownerId', async () => {
    const ownerId = 1
    const petData = PetDataBuilder({ ownerId })
    const pet1 = new PetEntity(petData, 1)
    const pet2 = new PetEntity(PetDataBuilder({ ownerId }), 2)
    repository.setItems([pet1, pet2])

    const output = await sut.execute({ ownerId })
    expect(output).toEqual([pet1.toJSON(), pet2.toJSON()])
  })

  it('should return an empty list when no pets belong to the given ownerId', async () => {
    const ownerId = 1
    const petData = PetDataBuilder({ ownerId: 2 })
    const pet = new PetEntity(petData, 1)
    repository.setItems([pet])

    expect(sut.execute({ ownerId: 1 })).rejects.toThrow(
      new NotFoundError(`No pets found for owner with ID: 1`),
    )
  })
})
