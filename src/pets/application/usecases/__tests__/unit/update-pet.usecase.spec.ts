import { PetInMemoryRepository } from '@/pets/infrastructure/database/in-memory/repositories/pet-in-memory.repository'
import { PetEntity, PetProps } from '@/pets/domain/entities/pet.entity'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UpdatePetUseCase } from '../../update-pet.usecase'

describe('UpdatePetUseCase unit tests', () => {
  let sut: UpdatePetUseCase.UseCase
  let repository: PetInMemoryRepository

  beforeEach(() => {
    repository = new PetInMemoryRepository()
    sut = new UpdatePetUseCase.UseCase(repository)
  })

  it('should throw an error if pet is not found', async () => {
    const input = { id: 4324, key: 'name', value: 'Max' }

    await expect(sut.execute(input)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('should update the pet when found', async () => {
    const petData: PetProps = PetDataBuilder({})
    const pet = new PetEntity(petData, 324)
    repository.setItems([pet])

    const input = { id: 324, key: 'name', value: 'Max' }

    await sut.execute(input)

    const updatedPet = await repository.findById(324)
    expect(updatedPet?.name).toBe('Max')
  })

  it('should throw error if required fields are missing', async () => {
    const input = { id: 324, key: '', value: '' }

    await expect(sut.execute(input)).rejects.toThrow(
      new Error('Input data not provided'),
    )
  })

  it('should update pet with valid data', async () => {
    const petData = PetDataBuilder({ name: 'Rex' })
    const pet = new PetEntity(petData, 324)
    repository.setItems([pet])

    const input = { id: 324, key: 'name', value: 'Max' }

    await sut.execute(input)

    const updatedPet = await repository.findById(324)
    expect(updatedPet?.name).toBe('Max')
  })
})
