import { PetInMemoryRepository } from '@/pets/infrastructure/database/in-memory/repositories/pet-in-memory.repository'
import { PetEntity, PetProps } from '@/pets/domain/entities/pet.entity'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { UpdatePetUseCase } from '../../update-pet.usecase'

describe('UpdatePetUseCase unit tests', () => {
  let sut: UpdatePetUseCase.UseCase
  let repository: PetInMemoryRepository

  beforeEach(() => {
    repository = new PetInMemoryRepository()
    sut = new UpdatePetUseCase.UseCase(repository)
  })

  it('should update a pet with valid input', async () => {
    const createdAt = new Date()
    const pet = new PetEntity(
      PetDataBuilder({
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        weight: 10,
        createdAt,
      }),
      1,
    )
    repository.setItems([pet])

    const input = {
      id: 1,
      name: 'Max',
      weight: 15,
      breed: 'Labrador',
    }

    const output = await sut.execute(input)

    expect(output).toStrictEqual({
      id: 1,
      name: 'Max',
      species: 'Dog',
      breed: 'Labrador',
      ownerId: pet.props.ownerId,
      birthDate: pet.props.birthDate,
      weight: pet.props.weight,
      createdAt: pet.props.createdAt,
    })

    const updatedPet = repository.getItemByIndex(0)
    expect(updatedPet.name).toBe('Max')
    expect(updatedPet.species).toBe('Dog')
    expect(updatedPet.breed).toBe('Labrador')
  })

  it('should throw an error if the pet ID is not provided', async () => {
    const input = {
      name: 'Max',
      breed: 'Labrador',
    }

    await expect(sut.execute(input as any)).rejects.toThrow(
      'Pet ID is required',
    )
  })

  it('should throw an error if the pet does not exist', async () => {
    const input = {
      id: 999,
      name: 'Max',
      species: 'Dog',
      breed: 'Labrador',
    }

    await expect(sut.execute(input)).rejects.toThrow('Entity not found')
  })

  it('should update only the fields provided', async () => {
    const pet = new PetEntity(
      PetDataBuilder({
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
      }),
      1,
    )
    repository.setItems([pet])

    const input = {
      id: 1,
      name: 'Max',
    }

    const output = await sut.execute(input)

    expect(output).toStrictEqual({
      id: 1,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      weight: pet.props.weight,
      ownerId: pet.props.ownerId,
      birthDate: pet.props.birthDate,
      createdAt: pet.props.createdAt,
    })

    const updatedPet = repository.getItemByIndex(0)
    expect(updatedPet.name).toBe('Max')
    expect(updatedPet.species).toBe('Dog')
    expect(updatedPet.breed).toBe('Golden Retriever')
  })

  it('should not update if no changes are made', async () => {
    const pet = new PetEntity(
      PetDataBuilder({
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
      }),
      1,
    )
    repository.setItems([pet])

    const input = {
      id: 1,
    }

    const output = await sut.execute(input)

    expect(output).toStrictEqual({
      id: 1,
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      weight: pet.props.weight,
      ownerId: pet.props.ownerId,
      birthDate: pet.props.birthDate,
      createdAt: pet.props.createdAt,
    })

    const unchangedPet = repository.getItemByIndex(0)
    expect(unchangedPet.name).toBe('Buddy')
    expect(unchangedPet.species).toBe('Dog')
    expect(unchangedPet.breed).toBe('Golden Retriever')
  })
})
