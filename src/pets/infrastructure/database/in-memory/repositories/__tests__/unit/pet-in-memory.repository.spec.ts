import { PetInMemoryRepository } from '../../pet-in-memory.repository'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('PetInMemoryRepository unit tests', () => {
  let sut: PetInMemoryRepository

  beforeEach(() => {
    sut = new PetInMemoryRepository()
  })

  it('Should throw error when not found - findByName method', async () => {
    await expect(sut.findByName('Fido')).rejects.toThrow(
      new NotFoundError('Pet not found using name: Fido'),
    )
  })

  it('Should find a pet by name - findByName method', async () => {
    const pet = new PetEntity(PetDataBuilder({ name: 'Fido' }))
    await sut.insert(pet)
    const result = await sut.findByName(pet.name)
    expect(pet.toJSON()).toStrictEqual(result.toJSON())
  })

  it('Should throw error when pet name already exists - petNameExists method', async () => {
    const pet = new PetEntity(PetDataBuilder({ name: 'Fido', ownerId: 1 }))
    await sut.insert(pet)
    await expect(sut.petNameExists(pet.name, pet.ownerId)).rejects.toThrow(
      new ConflictError('Pet name already used for this owner'),
    )
  })

  it('Should not throw error when pet name does not exist for owner - petNameExists method', async () => {
    const pet = new PetEntity(PetDataBuilder({ name: 'Fido', ownerId: 1 }))
    await sut.insert(pet)
    await sut.petNameExists('Buddy', pet.ownerId) // This should pass without error
  })

  it('Should no filter items when filter object is null', async () => {
    const pet = new PetEntity(PetDataBuilder({ name: 'Fido' }))
    await sut.insert(pet)
    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')
    const itemsFiltered = await sut['applyFilter'](result, null)
    expect(spyFilter).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(result)
  })

  it('Should filter name field using filter param', async () => {
    const items = [
      new PetEntity(PetDataBuilder({ name: 'Fido' })),
      new PetEntity(PetDataBuilder({ name: 'fido' })),
      new PetEntity(PetDataBuilder({ name: 'Buddy' })),
    ]
    const spyFilter = jest.spyOn(items, 'filter')
    const itemsFiltered = await sut['applyFilter'](items, 'Fido')
    expect(spyFilter).toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual([items[0], items[1]])
  })

  it('Should sort by createdAt when sort param is null', async () => {
    const createdAt = new Date()
    const items = [
      new PetEntity(PetDataBuilder({ name: 'Fido', createdAt }), 1),
      new PetEntity(
        PetDataBuilder({
          name: 'Buddy',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
        2,
      ),
      new PetEntity(
        PetDataBuilder({
          name: 'Bella',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
        3,
      ),
    ]
    const itemsSorted = await sut['applySort'](items, null, null)
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('Should sort by name field', async () => {
    const items = [
      new PetEntity(PetDataBuilder({ name: 'Cody' })),
      new PetEntity(PetDataBuilder({ name: 'Bella' })),
      new PetEntity(PetDataBuilder({ name: 'Alex' })),
    ]
    let itemsSorted = await sut['applySort'](items, 'name', 'asc')
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])

    itemsSorted = await sut['applySort'](items, 'name', null)
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]])
  })

  it('Should sort by breed field', async () => {
    const items = [
      new PetEntity(PetDataBuilder({ breed: 'Cody' })),
      new PetEntity(PetDataBuilder({ breed: 'Bella' })),
      new PetEntity(PetDataBuilder({ breed: 'Alex' })),
    ]
    let itemsSorted = await sut['applySort'](items, 'breed', 'asc')
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])

    itemsSorted = await sut['applySort'](items, 'breed', null)
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]])
  })

  it('Should find pets by ownerId - findByOwner method', async () => {
    const pet1 = new PetEntity(PetDataBuilder({ name: 'Fido', ownerId: 1 }))
    const pet2 = new PetEntity(PetDataBuilder({ name: 'Buddy', ownerId: 1 }))
    const pet3 = new PetEntity(PetDataBuilder({ name: 'Bella', ownerId: 2 }))
    await sut.insert(pet1)
    await sut.insert(pet2)
    await sut.insert(pet3)

    const pets = await sut.findByOwner(1)
    expect(pets).toHaveLength(2)
    expect(pets).toEqual([pet1, pet2])
  })

  it('Should throw error when no pets found for ownerId - findByOwner method', async () => {
    await expect(sut.findByOwner(99)).rejects.toThrow(
      new NotFoundError('No pets found for owner with ID: 99'),
    )
  })
})
