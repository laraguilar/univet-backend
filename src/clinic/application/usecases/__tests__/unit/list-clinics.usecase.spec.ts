import { ClinicInMemoryRepository } from '@/clinic/infrastructure/database/in-memory/repositories/clinic-in-memory.repository'
import { ListClinicsUseCase } from '../../list-clinics.usecase'
import { ClinicRepository } from '@/clinic/domain/repositories/clinic.repository'
import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'
import { ClinicDataBuilder } from '@/clinic/domain/testing/helpers/clinic-data-builder'

describe('ListClinicsUseCase unit tests', () => {
  let sut: ListClinicsUseCase.UseCase
  let repository: ClinicInMemoryRepository

  beforeEach(() => {
    repository = new ClinicInMemoryRepository()
    sut = new ListClinicsUseCase.UseCase(repository)
  })

  it('toOutput method', () => {
    let result = new ClinicRepository.SearchResult({
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

    const entity = new ClinicEntity(ClinicDataBuilder({}))
    result = new ClinicRepository.SearchResult({
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
      new ClinicEntity(ClinicDataBuilder({ createdAt }), 1),
      new ClinicEntity(
        ClinicDataBuilder({ createdAt: new Date(createdAt.getTime() + 10) }),
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
      new ClinicEntity(ClinicDataBuilder({ name: 'a' })),
      new ClinicEntity(ClinicDataBuilder({ name: 'AA' })),
      new ClinicEntity(ClinicDataBuilder({ name: 'Aa' })),
      new ClinicEntity(ClinicDataBuilder({ name: 'b' })),
      new ClinicEntity(ClinicDataBuilder({ name: 'c' })),
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
