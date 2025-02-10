import { CreateClinicUseCase } from '../../create-clinic.usecase'
import { ClinicDataBuilder } from '@/clinic/domain/testing/helpers/clinic-data-builder'
import { ClinicInMemoryRepository } from '@/clinic/infrastructure/database/in-memory/repositories/clinic-in-memory.repository'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('CreateClinicUseCase unit tests', () => {
  let sut: CreateClinicUseCase.UseCase
  let repository: ClinicInMemoryRepository

  beforeEach(() => {
    repository = new ClinicInMemoryRepository()
    sut = new CreateClinicUseCase.UseCase(repository)
  })

  it('Should create a clinic', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')

    const props = ClinicDataBuilder({})
    const result = await sut.execute({
      name: props.name,
      cnpj: props.cnpj,
      zipCode: props.zipCode,
      street: props.street,
      number: props.number,
      neighborhood: props.neighborhood,
      city: props.city,
      state: props.state,
    })
    expect(result.id).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('Should throw error when name not provided', async () => {
    const props = ClinicDataBuilder({})
    await expect(
      sut.execute({
        name: null,
        cnpj: props.cnpj,
        zipCode: props.zipCode,
        street: props.street,
        number: props.number,
        neighborhood: props.neighborhood,
        city: props.city,
        state: props.state,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when cnpj not provided', async () => {
    const props = ClinicDataBuilder({})
    await expect(
      sut.execute({
        name: props.name,
        cnpj: null,
        zipCode: props.zipCode,
        street: props.street,
        number: props.number,
        neighborhood: props.neighborhood,
        city: props.city,
        state: props.state,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when zipCode not provided', async () => {
    const props = ClinicDataBuilder({})
    await expect(
      sut.execute({
        name: props.name,
        cnpj: props.cnpj,
        zipCode: null,
        street: props.street,
        number: props.number,
        neighborhood: props.neighborhood,
        city: props.city,
        state: props.state,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when street not provided', async () => {
    const props = ClinicDataBuilder({})
    await expect(
      sut.execute({
        name: props.name,
        cnpj: props.cnpj,
        zipCode: props.zipCode,
        street: null,
        number: props.number,
        neighborhood: props.neighborhood,
        city: props.city,
        state: props.state,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when number not provided', async () => {
    const props = ClinicDataBuilder({})
    await expect(
      sut.execute({
        name: props.name,
        cnpj: props.cnpj,
        zipCode: props.zipCode,
        street: props.street,
        number: null,
        neighborhood: props.neighborhood,
        city: props.city,
        state: props.state,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when neighborhood not provided', async () => {
    const props = ClinicDataBuilder({})
    await expect(
      sut.execute({
        name: props.name,
        cnpj: props.cnpj,
        zipCode: props.zipCode,
        street: props.street,
        number: props.number,
        neighborhood: null,
        city: props.city,
        state: props.state,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when city not provided', async () => {
    const props = ClinicDataBuilder({})
    await expect(
      sut.execute({
        name: props.name,
        cnpj: props.cnpj,
        zipCode: props.zipCode,
        street: props.street,
        number: props.number,
        neighborhood: props.neighborhood,
        city: null,
        state: props.state,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when state not provided', async () => {
    const props = ClinicDataBuilder({})
    await expect(
      sut.execute({
        name: props.name,
        cnpj: props.cnpj,
        zipCode: props.zipCode,
        street: props.street,
        number: props.number,
        neighborhood: props.neighborhood,
        city: props.city,
        state: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })
})
