import { PetInMemoryRepository } from '@/pets/infrastructure/database/in-memory/repositories/pet-in-memory.repository'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { DeletePetUseCase } from '../../delete-pet.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'

describe('DeletePetUseCase', () => {
  let sut: DeletePetUseCase.UseCase
  let petRepository: PetInMemoryRepository
  let userRepository: UserInMemoryRepository

  beforeEach(() => {
    petRepository = new PetInMemoryRepository()
    userRepository = new UserInMemoryRepository()
    sut = new DeletePetUseCase.UseCase(petRepository)
  })

  it('should throw NotFoundError if pet does not exist', async () => {
    const nonExistentPetId = 999

    await expect(sut.execute({ id: nonExistentPetId })).rejects.toThrow(
      new NotFoundError(`Entity not found`),
    )
  })

  it('should delete pet successfully if it exists', async () => {
    const user = new UserEntity(UserDataBuilder({ name: 'John Doe' }), 1)
    await userRepository.insert(user)

    const pet = new PetEntity(
      PetDataBuilder({ name: 'Buddy', ownerId: user._id }),
      1,
    )
    await petRepository.insert(pet)

    await expect(sut.execute({ id: pet.id })).resolves.not.toThrow()
    const deletedPet = petRepository.getItems().find(pet => pet.id === 1)
    expect(deletedPet).toBeUndefined()
  })
})
