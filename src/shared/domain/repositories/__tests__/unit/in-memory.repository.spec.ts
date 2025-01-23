import { Entity } from '@/shared/domain/entities/entity'
import { InMemoryRepository } from '../../in-memory-repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

type StubEntityProps = {
  name: string
  price: number
}
class StubEntity extends Entity<StubEntityProps> {}
class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository', () => {
  let sut: StubInMemoryRepository
  let entity: StubEntity

  beforeEach(() => {
    sut = new StubInMemoryRepository()
  })

  // insert method
  it('should insert a new entity', async () => {
    entity = new StubEntity({ name: 'test', price: 100 }, 1)
    await sut.insert(entity)
    expect(entity.toJSON()).toStrictEqual(sut.getItemByIndex(0).toJSON())
  })

  // update method (invalid case)
  it('should throw error on update when entity not found', async () => {
    entity = new StubEntity({ name: 'test', price: 100 }, 1)
    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  // update method (valid case)
  it('should update an entity', async () => {
    entity = new StubEntity({ name: 'test', price: 100 }, 1)
    await sut.insert(entity)
    const updatedEntity = new StubEntity(
      { name: 'updated', price: 20 },
      entity.id,
    )
    await sut.update(updatedEntity)
    expect(updatedEntity.toJSON()).toStrictEqual(sut.getItemByIndex(0).toJSON())
  })

  // findById method (invalid case)
  it('should throw NotFoundError when entity not found', async () => {
    await expect(sut.findById(1232)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  // findById method (valid case)
  it('should find an entity by id', async () => {
    entity = new StubEntity({ name: 'test', price: 100 }, 1)
    await sut.insert(entity)
    const result = await sut.findById(entity.id)
    expect(entity.toJSON()).toStrictEqual(result?.toJSON())
  })

  // findAll method
  it('should return all entities', async () => {
    entity = new StubEntity({ name: 'test', price: 100 }, 1)
    await sut.insert(entity)
    const result = await sut.findAll()
    expect([entity]).toStrictEqual(result)
  })

  // delete method (invalid case)
  it('should throw an error when entity not found', async () => {
    await expect(sut.delete(123)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  // delete method (valid case)
  it('should delete an entity', async () => {
    await sut.insert(entity)
    await sut.delete(entity.id)
    const entities = await sut.findAll()
    expect(entities).toHaveLength(0)
  })
})
