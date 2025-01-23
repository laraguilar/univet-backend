import { GetPetUseCase } from '../../get-pet.usecase'
import { PetInMemoryRepository } from '@/pets/infrastructure/database/in-memory/repositories/pet-in-memory.repository'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

describe('GetPetUseCase unit tests', () => {
  let sut: GetPetUseCase.UseCase
  let repository: PetInMemoryRepository

  beforeEach(() => {
    repository = new PetInMemoryRepository()
    sut = new GetPetUseCase.UseCase(repository)
  })

  it('should return null when pet is not found', async () => {
    expect(sut.execute({ id: 4324 })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('should return the pet when found', async () => {
    const petData = PetDataBuilder({})
    const pet = new PetEntity(petData, 324)
    repository.setItems([pet])

    const output = await sut.execute({ id: 324 })
    expect(output).toEqual(pet.toJSON())
  })

  it('should return null when no pet is found with the given id', async () => {
    const petData = PetDataBuilder({})
    const pet = new PetEntity(petData, 324)
    repository.setItems([pet])

    expect(sut.execute({ id: 4324 })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })
})
