import { PetInMemoryRepository } from '@/pets/infrastructure/database/in-memory/repositories/pet-in-memory.repository'
import { ListPetsUseCase } from '../../list-pets.usecase'
import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'

describe('ListPetsUseCase unit tests', () => {
  let sut: ListPetsUseCase.UseCase
  let repository: PetInMemoryRepository

  beforeEach(() => {
    repository = new PetInMemoryRepository()
    sut = new ListPetsUseCase.UseCase(repository)
  })

  it('toOutput method', () => {
    let result = new PetRepository.SearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    })
    let output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })

    const entity = new PetEntity(PetDataBuilder({}))
    result = new PetRepository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    })
    output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })
  })

  it('execute method', async () => {
    const createdAt = new Date()
    const items = [
      new PetEntity(PetDataBuilder({ createdAt }), 1),
      new PetEntity(
        PetDataBuilder({ createdAt: new Date(createdAt.getTime() + 10) }),
        2,
      ),
    ]
    repository.setItems(items)
    const output = await sut.execute({})
    expect(output).toStrictEqual({
      items: [...items].reverse().map(item => item.toJSON()),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    })
  })

  it('should return the pets using paginate, sort and filter', async () => {
    const items = [
      new PetEntity(PetDataBuilder({ name: 'a' })),
      new PetEntity(PetDataBuilder({ name: 'AA' })),
      new PetEntity(PetDataBuilder({ name: 'Aa' })),
      new PetEntity(PetDataBuilder({ name: 'b' })),
      new PetEntity(PetDataBuilder({ name: 'c' })),
    ]
    repository.setItems(items)
    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })

    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    })

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })

    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    })

    output = await sut.execute({
      page: 1,
      perPage: 3,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a',
    })

    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON(), items[1].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    })
  })
})
