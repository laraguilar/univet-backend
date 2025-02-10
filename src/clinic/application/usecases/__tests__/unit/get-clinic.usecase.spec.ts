import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { GetClinicUseCase } from '../../get-clinic.usecase'
import { ClinicInMemoryRepository } from '@/clinic/infrastructure/database/in-memory/repositories/clinic-in-memory.repository'
import { ClinicDataBuilder } from '@/clinic/domain/testing/helpers/clinic-data-builder'
import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'

describe('GetClinicUseCase unit tests', () => {
  let sut: GetClinicUseCase.UseCase
  let repository: ClinicInMemoryRepository

  beforeEach(() => {
    repository = new ClinicInMemoryRepository()
    sut = new GetClinicUseCase.UseCase(repository)
  })

  it('should return null when clinic is not found', async () => {
    expect(sut.execute({ id: 4324 })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('should return the clinic when found', async () => {
    const clinicData = ClinicDataBuilder({})
    const clinic = new ClinicEntity(clinicData, 324)
    repository.setItems([clinic])

    const output = await sut.execute({ id: 324 })
    expect(output).toEqual(clinic.toJSON())
  })

  it('should return null when no clinic is found with the given id', async () => {
    const clinicData = ClinicDataBuilder({})
    const clinic = new ClinicEntity(clinicData, 324)
    repository.setItems([clinic])

    expect(sut.execute({ id: 4324 })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })
})
