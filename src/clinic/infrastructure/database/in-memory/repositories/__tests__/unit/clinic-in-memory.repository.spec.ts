import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ClinicInMemoryRepository } from '../../clinic-in-memory.repository'
import { ClinicDataBuilder } from '@/clinic/domain/testing/helpers/clinic-data-builder'

describe('ClinicInMemoryRepository unit tests', () => {
  let sut: ClinicInMemoryRepository

  beforeEach(() => {
    sut = new ClinicInMemoryRepository()
  })

  it('Should throw error when not found - findByName method', async () => {
    await expect(sut.findByName('Health Clinic')).rejects.toThrow(
      new NotFoundError('Clinic not found using name: Health Clinic'),
    )
  })

  it('Should find a clinic by name - findByName method', async () => {
    const clinic = new ClinicEntity({
      name: 'Health Clinic',
      cnpj: '12345678901234',
      zipCode: '12345-678',
      street: 'Main Street',
      number: 100,
      neighborhood: 'Downtown',
      city: 'Metropolis',
      state: 'XY',
    })
    await sut.insert(clinic)
    const result = await sut.findByName(clinic.props.name)
    expect(clinic.toJSON()).toStrictEqual(result?.toJSON())
  })

  it('Should no filter items when filter object is null', async () => {
    const clinic = new ClinicEntity({
      name: 'Health Clinic',
      cnpj: '12345678901234',
      zipCode: '12345-678',
      street: 'Main Street',
      number: 100,
      neighborhood: 'Downtown',
      city: 'Metropolis',
      state: 'XY',
    })
    await sut.insert(clinic)
    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')
    const itemsFiltered = await sut['applyFilter'](result, null)
    expect(spyFilter).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(result)
  })

  it('Should filter name field using filter param', async () => {
    const items = [
      new ClinicEntity(ClinicDataBuilder({ name: 'Health Clinic' })),
      new ClinicEntity(ClinicDataBuilder({ name: 'health clinic' })),
      new ClinicEntity(ClinicDataBuilder({ name: 'Wellness Center' })),
    ]
    const spyFilter = jest.spyOn(items, 'filter')
    const itemsFiltered = await sut['applyFilter'](items, 'Health Clinic')
    expect(spyFilter).toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual([items[0], items[1]])
  })

  it('Should sort by createdAt when sort param is null', async () => {
    const createdAt = new Date()
    const items = [
      new ClinicEntity(ClinicDataBuilder({ name: 'A', createdAt })),
      new ClinicEntity(
        ClinicDataBuilder({
          name: 'B',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new ClinicEntity(
        ClinicDataBuilder({
          name: 'C',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ]
    const itemsSorted = await sut['applySort'](items, null, null)
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  //   it('Should sort by name field', async () => {
  //     const items = [
  //       new ClinicEntity(ClinicDataBuilder({ name: 'Zeta Clinic' })),
  //       new ClinicEntity(ClinicDataBuilder({ name: 'Alpha Clinic' })),
  //       new ClinicEntity(ClinicDataBuilder({ name: 'Beta Clinic' })),
  //     ]
  //     let itemsSorted = await sut['applySort'](items, 'name', 'asc')
  //     expect(itemsSorted).toStrictEqual([items[0], items[2], items[1]])

  //     itemsSorted = await sut['applySort'](items, 'name', null)
  //     expect(itemsSorted).toStrictEqual([items[1], items[2], items[0]])
  //   })
})
