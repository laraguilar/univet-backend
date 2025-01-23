import { PetInMemoryRepository } from '@/pets/infrastructure/database/in-memory/repositories/pet-in-memory.repository'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { DeletePetUseCase } from '../../delete-pet.usecase'

describe('DeletePetUseCase', () => {
  let sut: DeletePetUseCase
  let petRepository: PetInMemoryRepository

  beforeEach(() => {
    petRepository = new PetInMemoryRepository()
    sut = new DeletePetUseCase(petRepository)
  })

  it('should throw NotFoundError if pet does not exist', async () => {
    const nonExistentPetId = 999

    await expect(sut.execute(nonExistentPetId)).rejects.toThrow(
      new NotFoundError(`Entity not found`),
    )
  })

  it('should delete pet successfully if it exists', async () => {
    const pet = new PetEntity(PetDataBuilder({ name: 'Buddy' }), 1)
    await petRepository.insert(pet)

    await expect(sut.execute(pet.id)).resolves.not.toThrow()
    const deletedPet = petRepository.getItems().find(pet => pet.id === 1)
    expect(deletedPet).toBeUndefined()
  })
})
